let addImage = false;

document.addEventListener("DOMContentLoaded", () => {

    const newImageButton = document.querySelector("#new-image-btn");
    const imageFormContainer = document.querySelector("div.container");
    const imageForm = document.querySelector(".add-image-form")
    const imageContainer = document.querySelector("div.image-container")

    newImageButton.addEventListener("click", () => {
        addImage = !addImage;
        if (addImage) {
            imageFormContainer.style.display = "block";
        } else {
            imageFormContainer.style.display = "none";
        }
    })

    function fetchImages() {
        fetch("http://localhost:3000/api/v1/images")
            .then(response => response.json())
            .then(images => showImages(images))
    }

    function showImages(images) {
        images.forEach(image => displayImage(image))
    }

    function displayImage(image) {

        let divImage = document.createElement("div")
        divImage.className = "image-card"

        let h2 = document.createElement("h2")
        h2.className = "title"
        h2.innerText = image.title

        let buttonDelete = document.createElement('button')
        buttonDelete.innerText = 'Delete'
        buttonDelete.className = 'delete-image'

        h2.appendChild(buttonDelete)

        // Delete Image Button
        buttonDelete.addEventListener('click', () => {
            fetch(`http://localhost:3000/api/v1/images/${image.id}`, {
                method: 'DELETE'
            })
                .then(() => { divImage.remove() })
        })

        let img = document.createElement("img")
        img.className = "image"
        img.src = image.url

        let divLikes = document.createElement("div")
        divLikes.className = "likes-section"

        let span = document.createElement("span")
        span.className = "likes"
        span.innerText = image.likes + " Likes"

        // Like Button
        let buttonLikes = document.createElement("button")
        buttonLikes.className = "like-button"
        buttonLikes.innerText = "❤️"

        buttonLikes.addEventListener("click", () => {
            fetch(`http://localhost:3000/api/v1/images/${image.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    likes: ++image.likes
                })
            })
                .then(response => response.json())
                .then(updatedImage => {
                    span.innerText = updatedImage.likes + " Likes"
                    image = updatedImage
                })
        })

        // Dislike Button
        let buttonDislike = document.createElement('button')
        buttonDislike.innerText = '💔'
        buttonDislike.className = "dislike"

        buttonDislike.addEventListener('click', () => {

            const configObj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    likes: --image.likes
                })
            }

            fetch(`http://localhost:3000/api/v1/images/${image.id}`, configObj)
                .then(res => res.json())
                .then(updatedImage => {
                    image = updatedImage
                    span.innerText = `${image.likes} Likes`
                })

        })

        let ul = document.createElement("ul")
        ul.className = "comments"
        ul.textContent = ""

        let form = document.createElement("form")
        form.className = "comment-form"

        let input = document.createElement("input")
        input.className = "comment-input"
        input.type = "text"
        input.name = "comment"
        input.placeholder = "Add a comment..."

        let button = document.createElement("button")
        button.className = "comment-button"
        button.type = "submit"
        button.innerText = "Post"

        let br = document.createElement("br")

        // Add New Comment
        form.addEventListener("submit", () => {
            event.preventDefault()

            fetch("http://localhost:3000/api/v1/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    content: event.target[0].value,
                    image_id: image.id
                })
            })
                .then(response => response.json())
                .then(newComment => {

                    let li = document.createElement("li")
                    li.textContent = newComment.content

                    let deleteButton = document.createElement('li')
                    deleteButton.innerText = 'Delete'
                    deleteButton.className = 'delete-comment'

                    ul.append(li, deleteButton)
                    input.value = ""
                })
        })

        // Appending Everything
        form.append(input, button)
        divLikes.append(span, buttonLikes, buttonDislike)
        divImage.append(h2, img, divLikes, ul, form)
        imageContainer.append(br, divImage, br)

        // Fetching Comments
        function fetchComments() {
            fetch("http://localhost:3000/api/v1/comments")
                .then(res => res.json())
                .then(comments => {
                    comments.forEach(comment => displayComment(comment))
                })
        }

        function displayComment(comment) {

            let li = document.createElement('li')
            li.innerText = comment.content

            let deleteButton = document.createElement('li')
            deleteButton.innerText = 'Delete'
            deleteButton.className = 'delete-comment'

            // Delete Comment Button
            deleteButton.addEventListener('click', () => {
                fetch(`http://localhost:3000/api/v1/comments/${comment.id}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        li.remove(),
                            deleteButton.remove()
                    })
            })
            ul.append(li, deleteButton)

        }

        fetchComments()

    }

    fetchImages()

    // Adding a new image.
    imageForm.addEventListener("submit", () => {
        event.preventDefault()

        fetch("http://localhost:3000/api/v1/images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                "title": event.target[0].value,
                "url": event.target[1].value,
                "likes": 0
            })
        })
            .then(response => response.json())
            .then(newImage => {
                displayImage(newImage)
                imageForm.reset()
                imageFormContainer.style.display = "none"
                addImage = !addImage
            })
    })

})
