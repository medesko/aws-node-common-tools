const signedAxios = require('aws-signed-axios');

export const getUser = async (userId: string) => {
  const userUrl = `${process.env.USER_SERVICE_URL}${userId}`;

  const { data: result } = await signedAxios({
    method: 'GET',
    url: userUrl,
  });
  return result;
};
