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
    removePostsContent(divEl);
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    //remove active from everything first
    const buttonElements = document.querySelectorAll("[data-user-id]");
    //const buttonElements = document.querySelectorAll("button");
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

        //create data-album-user-id
        const dataAlbumUserIdAttr = document.createAttribute('data-album-user-id');
        dataAlbumUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const buttonAlbumEl = document.createElement('button');
        buttonAlbumEl.textContent = "Show albums";
        buttonAlbumEl.setAttributeNode(dataAlbumUserIdAttr);
        buttonAlbumEl.addEventListener('click', onLoadAlbums);   //create album button

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        const albumTdEl = document.createElement('td');
        albumTdEl.appendChild(buttonAlbumEl);   //create and append album td el

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(albumTdEl);    //append album ele

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


function onLoadAlbums() {
    const userId = this.getAttribute("data-album-user-id");

    const showAlbumsButtons = document.querySelectorAll("[data-album-user-id]");
    showAlbumsButtons.forEach(button => {
        if (button == this) {
            button.classList.add("active");
        }
        else {
            button.classList.remove("active");
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onAlbumsReceived);
    xhr.open("GET", BASE_URL + "/albums?userId=" + userId);
    xhr.send();
}

function onAlbumsReceived() {
    postsDivEl.style.display = 'block';

    //remove everything before
    const divEl = document.getElementById('posts-content');
    removePostsContent(divEl);

    const albums = JSON.parse(this.responseText);

    const ulEl = document.createElement("ul");

    albums.forEach(album => {
        const liEl = document.createElement("li");
        liEl.id = "album" + album.id;

        const pEl = document.createElement("p");
        const showAlbumBtn = document.createElement("button");
        showAlbumBtn.dataset.albumId = album.id;
        showAlbumBtn.innerHTML = "Show photos";

        showAlbumBtn.addEventListener("click", onLoadAlbumPhotos);

        //pEl.textContent = "id: " + album.id + " context: " + album.title;
        pEl.textContent = "Album: " + album.title;

        liEl.appendChild(pEl);
        liEl.appendChild(showAlbumBtn);
        ulEl.appendChild(liEl);
    });

    divEl.appendChild(ulEl);
}

function onLoadAlbumPhotos() {
    const showAlbumButtons = document.querySelectorAll("[data-album-id]");
    //console.log(showAlbumButtons);

    showAlbumButtons.forEach(button => {
        if (button == this) {
            button.classList.add("active");
        }
        else {
            button.classList.remove("active");
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onAlbumPhotosReceived);
    xhr.open("GET", BASE_URL + "/photos?albumId=" + this.dataset.albumId);
    xhr.send();
}

function onAlbumPhotosReceived() {
    const albumPhotos = JSON.parse(this.responseText);
    //const parentLiEl = document.querySelector(`[data-album-id="${albumPhotos[0].albumId}"]`).parentNode;

    const parentLiElements = document.querySelectorAll("[data-album-id]");

    //remove everything before
    parentLiElements.forEach(liEl => {
        if (liEl.parentNode.querySelector("ul"))
            liEl.parentNode.querySelector("ul").remove();

        if (liEl.dataset.albumId == albumPhotos[0].albumId) {
            liEl.parentNode.appendChild(createAlbumPhotos(albumPhotos));
            location.href = "#album" + albumPhotos[0].albumId;
        }
    });

    /* if (parentLiEl.querySelector("ul")) {
        parentLiEl.removeChild(parentLiEl.querySelector("ul"));
    } */
}

function createAlbumPhotos(albumPhotos) {
    const ulEl = document.createElement("ul");
    ulEl.id = "photos";

    const divEl = document.createElement("div");
    divEl.classList.add("image-box");

    albumPhotos.forEach(photo => {
        const imgEl = document.createElement("img");
        imgEl.src = photo.thumbnailUrl;
        imgEl.addEventListener("click", function () {
            viewImage(photo.url);
        });

        /* const liEl = document.createElement("li");
        liEl.appendChild(imgEl); */
        divEl.appendChild(imgEl);
        ulEl.appendChild(divEl);
        //ulEl.appendChild(liEl);
    });

    return ulEl;
}

function removePostsContent(divEl) {
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});

//image viewing

//document.addEventListener("change", viewImage);

function viewImage(src) {
    const imageModalEl = document.querySelector("#imageModal");
    imageModalEl.querySelector("img").src = src;

    imageModalEl.style.display = "block";

    imageModalEl.addEventListener("click", function (event) {
        if (event.target == imageModalEl.querySelector("img")) {
            console.log("clicked on image");
        }
        else {
            imageModalEl.style.display = "none";
            console.log("clicked outside");
        }
    });
}