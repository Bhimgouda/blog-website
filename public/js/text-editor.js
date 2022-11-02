var quill = new Quill("#editor-container", {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
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
  content.value = quill.root.innerHTML;
  editor.console.log(
    "Submitted",
    $(form).serialize(),
    $(form).serializeArray()
  );

  // No back end to actually submit to!
  alert("Open the console to see the submit data!");
  return false;
};
