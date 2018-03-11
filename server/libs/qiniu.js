import qiniu from 'qiniu';
import config from '../config';

const bucket = 'hexo-blog';

const options = {
  scope: bucket,
};

const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);

export const uptoken = () => {
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  return uploadToken;
};
