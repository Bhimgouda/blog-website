var editor = new Quill("#editor-container", {
  modules: {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic"],
      ["link", "blockquote", "code-block", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  },
  placeholder: "Compose an epic...",
  theme: "snow",
});

var form = document.querySelector("form");
form.onsubmit = function () {
  // Populate hidden form on submit
  var content = document.querySelector("input[name=content]");
  content.value = editor.root.innerHTML;
};

function selectLocalImage() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  // Listen upload local image and save to server
  input.onchange = () => {
    const file = input.files[0];

    // file type is only image.
    if (/^image\//.test(file.type)) {
      saveToServer(file);
    } else {
      console.warn("You could only upload images.");
    }
  };
}

/**
 * Step2. save to server
 *
 * @param {File} file
 */
function saveToServer(file) {
  const fd = new FormData();
  fd.append("image", file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/articles/image-urls", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      // this is callback data: url
      const url = JSON.parse(xhr.responseText).url;
      insertToEditor(url);
    }
  };
  xhr.send(fd);
}

/**
 * Step3. insert image url to rich editor.
 *

 */
function insertToEditor(url) {
  // push image url to rich editor.
  const range = editor.getSelection();
  editor.insertEmbed(range.index, "image", url);
}

// quill editor add image handler
editor.getModule("toolbar").addHandler("image", () => {
  selectLocalImage();
});

editor.getModule("toolbar").addHandler("image", () => {
  selectLocalImage();
});
