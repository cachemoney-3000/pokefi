import React from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";

const AUTH_URL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

function LoginPage() {
  return (

    <div class="py-2 bg-[#2b292c] text-slate-50 h-screen overflow-hidden">
        <header class="px-5 sm:px-10 md:px-10 md:py-5 lg:px-20 flex items-center justify-between">
        <div>
          <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png" class="w-48"/>
        </div>
      </header>

<main>
  <div id="hero" class="lg:flex items-center mt-8">
    <div class="px-10 sm:px-12 md:px-12 md:flex lg:block lg:w-1/2 lg:max-w-3xl lg:mr-4 lg:px-20">
      <div class="md:w-1/2 md:mr-10 lg:w-full lg:mr-0">
        <h1 class="text-3xl xl:text-4xl font-black md:leading-none xl:leading-tight">
          Discover New Music
        </h1>
        <p class="mt-4 xl:mt-2 lg:text-lg">
            Embark on a thrilling journey to discover fresh, exciting music that resonates with your unique taste 
            and preferences, all with the help of your beloved and trusted Pokémon companions, whose meticulously 
            curated playlists are waiting to be explored and savored, as you immerse yourself in a musical landscape 
            that captivates your senses and leaves you inspired and enriched.
        </p>
      </div>

      <div class="flex-1">
        <a href={AUTH_URL}>
          <button class="transition-all duration-500 mt-5 w-full rounded-2xl font-black 
          tracking-wide text-lg px-5 py-4 focus:outline-none focus:shadow-outline bg-[#1ed760] 
          text-[#2b292c] hover:bg-[#18ac4d] hover:text-[#222123]">Login With Spotify</button>
        </a>
      </div>
    </div>

    <div class="mt-6 flex-1 lg:mt-0 px-10">
      <img class="" src="https://images.unsplash.com/photo-1524749292158-7540c2494485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=85" />
    </div>
    
  </div>
</main>

<footer class="px-5 sm:px-10 md:px-20 py-8 fixed bottom-0 left-0 w-full">
  <div class="flex flex-col items-center lg:flex-row-reverse justify-between">
    <div class="mt-4">
      <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png" class="w-32"/>
    </div>
  </div>
</footer>
</div>

  );
}

export default LoginPage;
