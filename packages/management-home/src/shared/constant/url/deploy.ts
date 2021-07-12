export default {
  GET_DEPLOY_LIST: ['/service-release', '/mock/deploy/apply-list.json'],
  DELETE_APPLY: ['/service-release/delete/_', '/mock/deploy/apply-delete.json'],
  GET_REVIEW_LIST: ['/service-release', '/mock/deploy/review-list.json'],
  // REVIEW_APPLY: ['/publish/apply/_', '/mock/deploy/review-approval.json'],
  REVIEW_APPLY: ['/publish/apply', '/mock/deploy/review-approval.json'],
  ADD_APPLY: ['/service-release', '/mock/deploy/apply-add.json'],
  UPDATE_APPLY: ['/service-release/_', '/mock/deploy/apply-update.json'],
  GET_SERVICE_LIST: ['/service-release/services/versions', '/mock/deploy/service.json'],
  // QUERY_IN_TENT: ['/users/search', 'mock/deploy/tenant-publisher.json'],
  QUERY_IN_TENT: ['/publish/apply-filter', 'mock/deploy/tenant-publisher.json'],
  GET_SNAPSHOT_NO: ['/service-release/snapshotno/_', 'mock/deploy/snap-shotno.json'],
};
