const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
//let comments 
let loadButtonEl;

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${post.body}`));

        //data post id
        const dataPostIdAttr = document.createAttribute("data-post-id");
        dataPostIdAttr.value = post.id;

        /* //data comment id
        const dataCommentIdAttr = document.createAttribute("data-comment-id");
        dataCommentIdAttr.value = post.id; */

        // creating list item
        const liEl = document.createElement('li');
        //liEl.setAttributeNode(dataPostIdAttr);
        liEl.appendChild(pEl);

        //create the button then append it
        const buttonEl = document.createElement("button");
        buttonEl.textContent = "See related comments";
        buttonEl.setAttributeNode(dataPostIdAttr);
        buttonEl.addEventListener("click", onLoadComments);
        liEl.appendChild(buttonEl);

        /* //create a div so we can reach this to put comments in
        const divEl = document.createElement("div");
        divEl.id = "comments-" + post.id;
        liEl.append(divEl);
        //-- */

        ulEl.appendChild(liEl);
    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    //remove active from everything first
    const buttonElements = document.querySelectorAll("[data-user-id]");
    buttonElements.forEach(button => {
        if (button != el) {
            button.classList.remove("active");
        } else {
            el.classList.add("active");
        }
    });

    //make active

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);

        tbodyEl.appendChild(trEl);
    }

    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

function onLoadComments() {
    const postId = this.getAttribute("data-post-id");

    //console.log("wtf is this", this.parentNode);
    //toggle active
    const buttonElements = document.querySelectorAll("[data-post-id]");
    buttonElements.forEach(button => {
        if (button != this) {
            button.classList.remove("active");
        } else {
            this.classList.add("active");
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onCommentsReceived);
    xhr.open("GET", BASE_URL + "/comments?postId=" + postId);
    xhr.send();
    //console.log("loaded!")
}

function onCommentsReceived() {
    const text = this.responseText;
    const comments = JSON.parse(text);

    /* console.log(comments);
    console.log(comments[0].postId); */

    const buttonElements = document.querySelectorAll("[data-post-id]");

    buttonElements.forEach(e => {
        if (e.parentNode.querySelector("ul") != null)
            e.parentNode.querySelector("ul").remove();

        if (e.getAttribute("data-post-id") == comments[0].postId) {
            //console.log(e.parentNode);
            e.parentNode.appendChild(createComments(comments));
        }
    });

    //create comments
    //console.log();
}

function createComments(comments) {
    const ulEl = document.createElement("ul");

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i]

        //data comment id
        const dataCommentIdAttr = document.createAttribute("data-comment-id");
        dataCommentIdAttr.value = comment.id;

        const liEl = document.createElement("li");
        liEl.setAttributeNode(dataCommentIdAttr);
        ulEl.appendChild(liEl);

        //Name
        const strongEl = document.createElement("strong");
        strongEl.textContent = comment.name;

        //Body text
        const pEl = document.createElement("p");
        pEl.textContent = comment.body;

        pEl.appendChild(strongEl);
        liEl.appendChild(pEl);
    }

    return ulEl;
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});