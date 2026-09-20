// https://api.example.com/users?page=2&limit=10


function runUrlDemo(): void{
  // how to create url object from url string

  const apiUrl = new URL('https://api.acedevhub.com/user?page=2&limit=10&sort=latest')


  console.log(apiUrl.href, apiUrl.protocol , apiUrl.hostname, apiUrl.pathname, apiUrl.search);


  console.log('-------------------');
  console.log(apiUrl.href); // https://api.acedevhub.com/user?page=2&limit=10&sort=latest
  console.log(apiUrl.protocol); // https:
  console.log(apiUrl.hostname); // api.acedevhub.com
  console.log(apiUrl.pathname); // /user
  console.log(apiUrl.search); // ?page=2&limit=10&sort=latest
  
  
  // get search params
  console.log('-------------------');
  const page = apiUrl.searchParams.get('page');
  const limit = apiUrl.searchParams.get('limit');
  const sort = apiUrl.searchParams.get('sort');
  console.log(page, limit, sort);
  
  
  // update/set search params
  console.log('-------------------');
  apiUrl.searchParams.set('page', '10');
  apiUrl.searchParams.set('limit', '20');
  
  console.log(apiUrl.href);
  

  // create search params from object
  console.log('-------------------');
  const queryParams = new URLSearchParams({
    search: 'Node JS',
    page: '1',
    limit: '5'
  })

  console.log(queryParams.toString());
}

runUrlDemo();