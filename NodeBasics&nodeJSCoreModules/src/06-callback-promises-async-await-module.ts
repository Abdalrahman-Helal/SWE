type User = {
  id: number;
  name: string;
  role: "user" | "super-admin";
};

const users: User[] = [
  {
    id: 1,
    name: "helal",
    role: "user",
  },

  {
    id: 2,
    name: "John",
    role: "user",
  },

  {
    id: 3,
    name: "roman",
    role: "user",
  },
];

// callback is a function - this function passing as a parameter to another function is called callback function

// callback(error , result ) -> *** important concepts -> classic node js callback pattern

// Callback example
function findUserWithCallback(
  userId: number,
  callback: (error: Error | null, user?: User) => void,
): void {
  setTimeout(() => {
    // api calling
    const user = users.find((curretUser) => curretUser.id === userId);

    if (!user) {
      callback(new Error(`user with id ${userId} was not found`));
      return;
    }
    callback(null, user);
  }, 500);
}

findUserWithCallback(3,(error,user) => {
  if(error){
    console.log('callback error', error.message);
    return
  }

  console.log('callback result',user?.id , user?.name , user?.role);
});
// ----------------------

// Promise Example
function findUserWithPromise(userId: number): Promise<User> {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((currentUser) => currentUser.id === userId)
      if(!user){
        reject(new Error(`user with ID: ${userId} data was not found`));
      }

      resolve(user);
    },1000)
  })
}

findUserWithPromise(10).then((user) => {
    console.log('promise result',user?.id , user?.name , user?.role);
 }).catch((error: Error) => {
    console.log("promsie error" , error.message);
 })

// async await example

async function findUserWithAsyncAwait(userId: number): Promise<void> {
  try {
    const user = await findUserWithPromise(userId);
    console.log('async/await' , user.name);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'
    console.log('async/await' , message);
  }
}

findUserWithAsyncAwait(2);
