const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getUserById,
} = require("./index");

// new function, should attempt to create a few users
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "ALBERT",
      location: "Bangladesh",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "SANDRA",
      location: "Jonesville",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "GLAM",
      location: "Salt Lake",
    });

    //console.log(albert);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}
async function createInitialPost() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "alberts title",
      content: "content from alberts elaborate brain",
    });
    await createPost({
      authorId: sandra.id,
      title: "sandras title",
      content: "content from sandra elaborate brain",
    });
    await createPost({
      authorId: glamgal.id,
      title: "glamgal title",
      content: "content from glamgal elaborate brain",
    });

    console.log("Finished creating posts");
  } catch (error) {
    console.log("Error creating posts");
    throw error;
  }
}
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR (255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts(
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users (id),
      title VARCHAR (255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
      );
    `);
    console.log("Finished building tables!");
    console.log("Hello");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPost();
  } catch (error) {
    console.log("Error rebuildingdb");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
