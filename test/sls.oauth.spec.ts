import { expect } from 'chai';
import { InitSlsOauth, SlsOauth  }  from '../lib/sls.oauth';

const testSlsOauthConfig = {
    "enabled": true,
    "url": "https://develop-sls.auth.eu-central-1.amazoncognito.com/",
    "accessToken": "",
    "clientId": "sgni72n31b21952u9d8nt5mfq", // test app clientId
    "clientSecret": "gc7qi7f549i1m7prtgjsj570ul1davdqnq8tkt69jahfj05nfbb",  // test app clientSecret
    "code": "",
    "redirectUri": "",
    "verbose": false,
    "debug": true

	};


describe('Service response test sls Oauth', async () => {
	it('should authentificated client app to sls Oauth service', async () => {
    const slsOauth: SlsOauth = await InitSlsOauth(testSlsOauthConfig);
		expect(slsOauth).haveOwnProperty('accessToken');
	});
});
