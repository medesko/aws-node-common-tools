export interface OAuthConfig {
	oauthUrl: string;
	url: string;
	token?: string;
	refreshToken?: string;
	clientId: string;
	clientSecret: string;
	code: string;
	redirectUri: string;
}

const firstRefreshTimeout = 3000000,
	refreshInterval = 3600000;

export class OAuth {
	public config: OAuthConfig;
	public token: string;
	public refreshToken: string;
	private interval: NodeJS.Timer | undefined;

	constructor(config: OAuthConfig) {
		this.config = config;
		this.token = config.token || '';
		this.refreshToken = config.refreshToken || '';
	}

	public Start(uuid: string): Promise<void> {
		let promise: Promise<any> = Promise.resolve();
		const accessTokenPresent = this.token != undefined && this.token != '';
		const refreshTokenPresent =
			this.refreshToken != undefined && this.refreshToken != '';

		if (accessTokenPresent)
			if (refreshTokenPresent)
				promise = promise
					.then(() => {})
					.catch(err => {
						promise = this.Signin(uuid);
					});
			else promise = this.Signin(uuid);
		else if (refreshTokenPresent) promise = this.Refresh(uuid);
		else promise = this.Signin(uuid);

		return promise
			.then(() => {
				setTimeout(() => {
					this.Refresh(uuid)
						.then(() => {
							this.interval = setInterval(() => {
								this.Refresh(uuid);
							}, refreshInterval);
						})
						.catch(err => {
							throw err;
						});
				}, firstRefreshTimeout);
			})
			.catch(err => {
				throw err;
			});
	}

	public Stop(): void {
		if (this.interval != undefined) clearInterval(this.interval);
	}

	protected buildHeaders(): { Authorization: string } {
		return {
			Authorization: `Basic ${this.token}`
		};
	}

	public Signin(uuid: string): Promise<any> {
		return Promise.resolve();
	}

	public Refresh(uuid: string): Promise<any> {
		return Promise.resolve();
	}
}
