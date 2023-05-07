import React from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";
import Logo from "../imgs/logo.png"
import Main from "../imgs/playlistGenerated.png"

const AUTH_URL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

function LoginPage() {
  return (

    <div className="py-2 bg-[#2b292c] text-slate-50 h-screen overflow-auto">
        <header className="px-5 sm:py-5 md:py-5 lg:px-20 flex items-center justify-between">
            <div>
                <img src={Logo} className="lg:h-12 md:h-8 sm:h-4" alt="logo"/>
            </div>
        </header>

    <main>
      <div id="hero" className="lg:flex items-center">

        <div className="mt-6 flex-1 lg:px-14 md:px-10 sm:px-5">
          <img src={Main} alt="screenshot" className="lg:h-4/5 lg:w-4/5 md:h-4/5 md:w-4/5 sm:h-5/5 sm:w-5/5 ml-auto lg:mr-0 md:mr-0 sm:mr-auto"/>
        </div>

        <div className="px-10 sm:px-12 md:px-12 md:flex lg:block lg:block lg:w-1/2 lg:max-w-3xl lg:mr-4 lg:px-20 w-fit lg:mt-0 md:mt-0 sm:mt-10">
          <div className="md:w-1/2 md:mr-10 lg:w-full lg:mr-0">
            <h1 className="text-3xl xl:text-4xl font-black md:leading-none xl:leading-tight">
              Discover New Music
            </h1>
            <p className="mt-4 xl:mt-2 lg:text-lg">
                Embark on a thrilling journey to discover fresh, exciting music that resonates with your unique taste 
                and preferences, all with the help of your beloved and trusted Pokémon companions, whose meticulously 
                curated playlists are waiting to be explored and savored, as you immerse yourself in a musical landscape 
                that captivates your senses and leaves you inspired and enriched.
            </p>
          </div>

          <div className="flex-1">
            <a href={AUTH_URL}>
              <button className="transition-all duration-500 lg:mt-5 md:mt-5 sm:mt-4 w-full rounded-2xl font-black 
              tracking-wide lg:text-lg md:text-lg sm:text-sm px-5 lg:py-5 md:py-4 sm:py-4 focus:outline-none focus:shadow-outline bg-[#1ed760] 
              text-[#2b292c] hover:bg-[#18ac4d] hover:text-[#222123]">Login With Spotify</button>
            </a>
          </div>
        </div>
      </div>
    </main>

    <a href="https://github.com/cachemoney-3000/pokefi" class="rounded-full w-12 h-12 bg-gray-400 fixed bottom-0 right-0 sm:top-5 sm:bottom-auto sm:right-0 sm:left-auto flex items-center justify-center text-gray-800 mr-8 mb-8 shadow-sm duration-300 ease-in-out transform hover:scale-110" target="_blank" rel="noreferrer">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
</a>




</div>

  );
}

export default LoginPage;
