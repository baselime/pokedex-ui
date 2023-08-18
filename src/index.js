const axios = require('axios');
const express =require('express');
const { default: pino } = require('pino-http');

const app = express();

app.use(pino());

app.get('/', async (request, reply) => {
  request.log.info('something')
  let pokemon = []
  let error = ''
  try {
    if (!request.query.pokemon) {
      const { data } = await axios.get('https://sfmcfkwy9l.execute-api.eu-west-1.amazonaws.com/prod/pokemon');
  
  
      pokemon = data.Items;
    } else {
      const { data } = await axios.get(`https://sfmcfkwy9l.execute-api.eu-west-1.amazonaws.com/prod/search?term=${request.query.pokemon}`)
  
      pokemon = data.map(el => el.document);
    }
  
  } catch(e) {
    error = e.message;
  }

  
  reply.type('text/html')
  return reply.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Pokedex</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Pokedex</h1>
    <h2 class="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Observe at <a class="underline" href="https://sandbox.baselime.io">sandbox.baselime.io</a></h2>
    <form class="w-full max-w-md lg:col-span-5 lg:pt-2 mb-10" action="/">
      <div class="flex gap-x-4">
        <label for="whos-that-pokemon" class="sr-only">Pokemon</label>
        <input id="whos-that-pokemon" name="pokemon" type="text" autocomplete="text" class="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Pika...">
        <button type="submit" class="flex-none rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yelow-600">Search</button>
      </div>
    </form>

    <div>${error ? error : ''}</div>
    <ul class="flex flex-col gap-6">
    ${pokemon.map(el => /*html*/`<li>
    <div class="p-4   bg-white rounded-lg overflow-hidden shadow-md flex flex-col items-center w-full">
    <img class="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${el.id}.png" alt="Pokemon Image">
    <div class="px-6 py-4 flex justify-around w-full"><div>

        <h2 class="font-semibold text-xl mb-2">${el.name.english}</h2>
        <p class="text-gray-600 text-sm mb-4">
            <span class="block">English: ${el.name.english}</span>
            <span class="block">Japanese: ${el.name.japanese}</span>
            <span class="block">Chinese: ${el.name.chinese}</span>
            <span class="block">French: ${el.name.french}</span>
        </p>
        </div>
        <div class="text-gray-700">
            <p class="mb-1">
                <span class="font-semibold">Type:</span> ${el.type}
            </p>
            <p class="font-semibold mb-1">Base Stats:</p>
            <ul class="list-disc list-inside pl-5">
                ${Object.entries(el.base).map(([key, value]) => `<li>${key}: ${value}</li>`).join('\n')}
              
            </ul>
        </div>
    </div>
</div>
    </li>`).join('\n')}
    </ul>
</div>
</div>
</div>
  <div>
    <div>
      </div>
  </body>
  </html>`)
});

app.get('/health', (req, res) => {
  res.send('OK')
});

app.listen(3000)