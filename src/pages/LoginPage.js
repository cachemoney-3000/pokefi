import React, { useEffect, useState } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce";
import { TYPE_COLOR_MAP } from "../utils/constants";

const TYPE_COLORS = Object.values(TYPE_COLOR_MAP);

function randomSprites(count = 12) {
	const ids = new Set();
	while (ids.size < count) {
		// IDs 1–898 cover gen 1–8 where sprites are reliable
		ids.add(Math.floor(Math.random() * 898) + 1);
	}
	return [...ids].map(id => ({
		id,
		color: TYPE_COLORS[Math.floor(Math.random() * TYPE_COLORS.length)],
	}));
}

function LoginPage() {
	const [loginUrl, setLoginUrl] = useState("");
	// Randomised on every page load — no API calls needed, sprite URLs just use the ID
	const [featured] = useState(() => randomSprites(12));

	useEffect(() => {
		const setupAuth = async () => {
			const codeVerifier = generateCodeVerifier(128);
			const codeChallenge = await generateCodeChallenge(codeVerifier);
			localStorage.setItem("code_verifier", codeVerifier);

			const authUrl = new URL(authEndpoint);
			authUrl.search = new URLSearchParams({
				client_id: clientId,
				response_type: 'code',
				redirect_uri: redirectUri,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge,
				scope: scopes.join(" "),
			}).toString();

			setLoginUrl(authUrl.toString());
		};
		setupAuth();
	}, []);

	return (
		<div className="min-h-screen bg-[#2b292c] text-white flex flex-col">

			{/* Main */}
	<main className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-8 md:py-10">
		<div className="max-w-5xl w-full flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-10 lg:gap-24">

				{/* Copy + CTA — always first in DOM so it's on top when stacked on mobile */}
				<div className="flex-1 max-w-md w-full mx-auto lg:mx-0">
				<p className="text-xs md:text-sm font-semibold tracking-widest mb-3 md:mb-4" style={{ color: '#1ed760' }}>
					PokeFi
				</p>

				<h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
					Pick a Pokémon.<br />Get its playlist.
				</h1>

				<p className="mt-4 md:mt-5 text-gray-400 text-sm md:text-base leading-relaxed">
					Think of it as the Pokédex, but for music. Each Pokémon gets a playlist based on its type and battle stats.
				</p>

					{/* Login button */}
					<a href={loginUrl} className="block mt-7 md:mt-10">
						<div className="rounded-2xl p-[1.5px]" style={{ backgroundColor: '#1ed760' }}>
							<button
								className="w-full rounded-[14.5px] py-3 px-5 md:py-4 md:px-6 text-xs md:text-sm font-bold text-[#111] transition-all duration-200 hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
								style={{ backgroundColor: '#1ed760' }}
							>
								<svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
									</svg>
									Continue with Spotify
								</button>
							</div>
						</a>

					<p className="mt-3 text-gray-600 text-xs text-center">
						Free or Premium both work.
					</p>
				</div>

				{/* Sprite grid — compact 4-col on mobile/tablet, 3-col on desktop */}
				<div className="flex-1 w-full max-w-sm lg:max-w-none">
					<div className="relative">
						{/* Right fade — desktop only */}
						<div className="hidden lg:block absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
							style={{ background: 'linear-gradient(to right, transparent, #2b292c)' }} />
						{/* Bottom fade */}
						<div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10"
							style={{ background: 'linear-gradient(to bottom, transparent, #2b292c)' }} />

						<div className="grid grid-cols-4 lg:grid-cols-3 gap-2 lg:gap-4">
							{featured.map(({ id, color }) => (
								<div
									key={id}
									className="rounded-xl lg:rounded-2xl flex items-center justify-center p-2 lg:p-3 aspect-square"
									style={{
										backgroundColor: `${color}20`,
										border: `1.5px solid ${color}35`,
									}}
								>
									<img
										src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
										alt=""
										className="w-full h-full object-contain"
										style={{ imageRendering: 'pixelated' }}
										draggable="false"
									/>
								</div>
							))}
						</div>
					</div>
				</div>

			</div>
		</main>

		{/* Footer */}
		<footer className="pb-6 flex justify-center">
			<a
				href="https://github.com/cachemoney-3000/pokefi"
				target="_blank"
				rel="noreferrer"
				className="flex items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors duration-200 text-xs"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
				</svg>
				View on GitHub
			</a>
		</footer>

		</div>
	);
}

export default LoginPage;
