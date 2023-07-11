import { CaptionFile, CaptionCues } from 'shared/data/resources';
import { GENERATING } from 'shared/data/constants'

export async function loadCaptionFiles(commit, params) {
  const captionFiles = await CaptionFile.where(params); // We update the IndexedDB resource
  commit('ADD_CAPTIONFILES', { captionFiles, nodeIds: params.contentnode_id }); // Now we update the vuex state
  return captionFiles;
}

export async function loadCaptionCues({ commit }, { caption_file_id }) {
  const cues = await CaptionCues.where({ caption_file_id });
  commit('ADD_CAPTIONCUES', cues);
  return cues;
}

export async function loadCaptions({ commit, rootGetters }, params) {
  const isAIFeatureEnabled = rootGetters['currentChannel/isAIFeatureEnabled'];
  if (!isAIFeatureEnabled) return;

  // If a new file is uploaded, the contentnode_id will be string
  if (typeof params.contentnode_id === 'string') {
    params.contentnode_id = [params.contentnode_id];
  }
  const nodeIdsToLoad = [];
  for (const nodeId of params.contentnode_id) {
    const node = rootGetters['contentNode/getContentNode'](nodeId);
    if (node && (node.kind === 'video' || node.kind === 'audio')) {
      nodeIdsToLoad.push(nodeId); // already in vuex
    } else if (!node) {
      nodeIdsToLoad.push(nodeId); // Assume that its audio/video
    }
  }

  const captionFiles = await loadCaptionFiles(commit, {
    contentnode_id: nodeIdsToLoad,
  });

  // If there is no Caption File for this contentnode
  // Don't request for the cues
  if (captionFiles.length === 0) return;
  // TODO: call loadCaptionCues -> to be done after
  // I finish saving captionFiles in indexedDB When
  // CTA is called. So I have captions saved in the backend.
}

export async function addCaptionFile({ state, commit }, { id, file_id, language, nodeId }) {
  const captionFile = {
    id: id,
    file_id: file_id,
    language: language,
  };
  // The file_id and language should be unique together in the vuex state. This check avoids duplicating existing caption data already loaded into vuex.
  const alreadyExists = state.captionFilesMap[nodeId]
    ? Object.values(state.captionFilesMap[nodeId]).find(
        file => file.language === captionFile.language && file.file_id === captionFile.file_id
      )
    : null;

  if (!alreadyExists) {
    // new created file will enqueue generate caption celery task
    captionFile[GENERATING] = true;
    return CaptionFile.add(captionFile).then(id => {
      commit('ADD_CAPTIONFILE', {
        captionFile,
        nodeId,
      });
    });
  }
}