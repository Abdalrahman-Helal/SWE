// external api calls
const API_URL = "https://jsonplaceholder.typicode.com/users/1"; 

type PlaceHolderUser = {
  id: number,
  name: string,
  email: string
  company: {
    name: string,

  }
}

type PublicUser = {
  id: number,
  name: string,
  email: string,
  company: string
}

function tranformUser(rawData: PlaceHolderUser): PublicUser {
  return {
    id: rawData.id,
    name: rawData.name,
    email: rawData.email,
    company: rawData.company.name
  }
}


async function fetchExternalUser(): Promise<void>{

  // AbortController is used to cancel the request if it takes too long
  const controller = new AbortController();

  const timeOut = setTimeout(() => {
    controller.abort();
  },5000)

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      signal: controller.signal
    });

    if(!response.ok){
      console.error(`upstream api failed with http ${response.status}`);
      return;
    }

    const rawUser = (await response.json()) as PlaceHolderUser;
    const user = tranformUser(rawUser);
    console.log(user);
    
  } catch(error) {
    if(error instanceof Error && error.name === 'AbortError'){
      console.error('Reqesut failed because it takes upstream api took so long');
      return;
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Request failed with error: ${message}`);

  } finally {
    clearTimeout(timeOut);
  }
}

fetchExternalUser();