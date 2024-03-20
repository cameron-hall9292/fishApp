

const goodbye = "goodbye";


async function hello() {
    console.log("hello");
    
}


hello()
    .then(() => {
    console.log("goodbye")
})
    .then(() => console.log("goodbye again!"))

