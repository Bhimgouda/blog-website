let Inline = Quill.import('blots/inline');
let Block = Quill.import('blots/block');
let BlockEmbed = Quill.import('blots/block/embed');


class BoldBlot extends Inline { }
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';

class ItalicBlot extends Inline { }
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

class LinkBlot extends Inline {
  static create(url) {
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    return node;
  }
  
  static formats(node) {
    return node.getAttribute('href');
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';

class BlockquoteBlot extends Block { }
BlockquoteBlot.blotName = 'blockquote';
BlockquoteBlot.tagName = 'blockquote';

class HeaderBlot extends Block {
  static formats(node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1;
  }
}
HeaderBlot.blotName = 'header';
HeaderBlot.tagName = ['H2',"H3"];

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('alt', value.alt);
    node.setAttribute('src', value.url);
    return node;
  }
  
  static value(node) {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src')
    };
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';


Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(LinkBlot);
Quill.register(BlockquoteBlot);
Quill.register(HeaderBlot);
Quill.register(ImageBlot);

let quill = new Quill('#editor-container');
quill.addContainer($("#tooltip-controls").get(0));
quill.addContainer($("#sidebar-controls").get(0));
quill.on(Quill.events.EDITOR_CHANGE, function(eventType, range) {
  if (eventType !== Quill.events.SELECTION_CHANGE) return;
  if (range == null) return;
  if (range.length === 0) {
    $('#tooltip-controls').hide();
    let [block, offset] = quill.scroll.descendant(Block, range.index);
    if (block != null && block.domNode.firstChild instanceof HTMLBRElement) {
      let lineBounds = quill.getBounds(range);
      $('#sidebar-controls').removeClass('active').show().css({
        left: lineBounds.left - 50,
        top: lineBounds.top - 2
      });
    } else {
      $('#tooltip-controls, #sidebar-controls').hide();
      $('#sidebar-controls').removeClass('active');
    }
  } else {
    $('#sidebar-controls, #sidebar-controls').hide();
    $('#sidebar-controls').removeClass('active');
    let rangeBounds = quill.getBounds(range);
    $('#tooltip-controls').show().css({
      left: rangeBounds.left + rangeBounds.width/2 - $('#tooltip-controls').outerWidth()/2,
      top: rangeBounds.bottom + 10
    });
  }
});

// For Title Validation
const title = document.getElementById("title")
const titleCount = document.querySelector(`[data-for="title"] span`)
const titleClass =  document.querySelector(`[data-for="title"]`).classList
if(titleCount.textContent >= 25 && titleCount.textContent <= 70) titleClass.add("valid")

validateInputChar(title, titleCount, 25, 70, titleClass)

// For description Validation
const description = document.getElementById("description")
const descriptionCount = document.querySelector(`[data-for="description"] span`)
const descriptionClass =  document.querySelector(`[data-for="description"]`).classList
if(descriptionCount.textContent >= 120 && descriptionCount.textContent <= 150) descriptionClass.add("valid")

validateInputChar(description, descriptionCount, 120, 150, descriptionClass)

// For TagLine Validation
const tagline = document.getElementById('tagline');
const taglineCount = document.querySelector(`[data-for="tagline"] span` )
const taglineClass =  document.querySelector(`[data-for="tagline"]`).classList
if(taglineCount.textContent >= 40 && taglineCount.textContent <= 60) taglineClass.add("valid")

validateInputChar(tagline, taglineCount, 40, 60, taglineClass)

// For SEO title Validation
const seoTitle = document.getElementById('seoTitle');
const seoTitleCount = document.querySelector(`[data-for="seoTitle"] span` )
const seoTitleClass =  document.querySelector(`[data-for="seoTitle"]`).classList
if(seoTitleCount.textContent >= 40 && seoTitleCount.textContent <= 60) seoTitleClass.add("valid")

validateInputChar(seoTitle, seoTitleCount, 40, 60, seoTitleClass)

function validateInputChar(inputElement, countDisplay, min, max,  classElement){
 inputElement.addEventListener("input", (e)=>{
    const charCount = e.target.value.length;
    countDisplay.textContent = charCount;
    if(classElement){
      if(charCount>=min && charCount<=max) return classElement.add('valid')
      return classElement.remove("valid")
    }
  })
}

// For keyword Validation
const keywords = document.getElementById("keywords")
const keywordsCount = document.querySelector(`[data-for="keywords"] span`)
const keywordsClass =  document.querySelector(`[data-for="keywords"]`).classList

if(keywordsCount.textContent >= 2 && keywordsCount.textContent <= 5) keywordsClass.add("valid");

keywords.addEventListener("input", (e)=>{
  const keywords = e.target.value.split(",").length
  keywordsCount.textContent = keywords
  if(keywords>=2 && keywords <=5) keywordsClass.add("valid")
  else keywordsClass.remove("valid")
})


// For Hero Image Validation
const heroImage = document.getElementById('heroImage');
const heroImageClass = document.querySelector(`[data-for="heroImage"]`)

heroImage.addEventListener("input", ()=>{
  if(heroImageClass){
    if(heroImage.files.length) heroImageClass.classList.add("valid")
  }
})

var form = document.querySelector("form");
form.onsubmit = function (e) {

  // Populate hidden form on submit
  // to get the title and content seperately from the editor container
  var content = document.querySelector("input[name=content]");
  content.value = quill.root.innerHTML

  if(heroImageClass){ // for new article and edit
    if(!(descriptionClass.contains("valid") && taglineClass.contains("valid") && titleClass.contains("valid") && seoTitleClass.contains("valid") && keywordsClass.contains("valid") && heroImageClass.classList.contains("valid") )){
      e.preventDefault()
    }
  }
  else{ // only for edit article
    if(!(descriptionClass.contains("valid") && taglineClass.contains("valid") && titleClass.contains("valid") && keywordsClass.contains("valid") && seoTitleClass.contains("valid"))){
      e.preventDefault()
    }
  }
};






document.querySelector("#bold").addEventListener("click",tooltipBtn)
document.querySelector("#italic").addEventListener("click",tooltipBtn)
document.querySelector("#blockquote").addEventListener("click",tooltipBtn)

function tooltipBtn(e){
  e.preventDefault()
  document.querySelectorAll("#tooltip-controls button").forEach(btn=>{
  if(this.classList.contains("tooltip-1")){
      if(btn.classList.contains("tooltip-2") && btn.id!=='blockquote'){
        btn.classList.remove("active")
      }
    }
else{
  if(btn.id.includes("header"))
  btn.classList.remove("active")
}
  })

  this.classList.toggle("active")
  if(this.classList.contains("active"))
  quill.format(this.id,true)
  else  quill.format(this.id, false);
}

document.querySelector("#link").addEventListener("click",function(e){
  e.preventDefault()
  this.classList.toggle("active")
  if(this.classList.contains("active")){
  let value = prompt('Enter link URL');
  quill.format('link', value);
  }
  else  quill.format('link', false);
})


// document.querySelector("#header-1").addEventListener("click",function(e){
// e.preventDefault();
// document.querySelectorAll("#tooltip-controls button").forEach(btn=>{
//   if(btn.id !== this.id)
//   btn.classList.remove("active")
// })
//   this.classList.toggle("active")
//   if(this.classList.contains("active"))
//   quill.format('header', 1);
//   else  quill.format("header", false);
// })


document.querySelector("#header-2").addEventListener("click",function(e){
e.preventDefault();
document.querySelectorAll("#tooltip-controls button").forEach(btn=>{
  if(btn.id !== this.id)
  btn.classList.remove("active")
})
  this.classList.toggle("active")
  if(this.classList.contains("active"))
  quill.format('header', 1);
  else  quill.format("header", false);
})

document.querySelector("#header-3").addEventListener("click",function(e){
  e.preventDefault()
  document.querySelectorAll("#tooltip-controls button").forEach(btn=>{
    if(btn.id !== this.id)
    btn.classList.remove("active")
})
  this.classList.toggle("active")
  if(this.classList.contains("active"))
  quill.format('header', 2);
  else  quill.format("header", false);
})









document.querySelector("#show-controls").addEventListener("click",function(e) {
  e.preventDefault()
  $('#sidebar-controls').toggleClass('active');
  quill.focus();
})

$('#image-button').click(function(e) {
  e.preventDefault()
  selectLocalImage()

});


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
  xhr.open("POST", "/articles/image-urls", true);
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
  let range = quill.getSelection(true);
  quill.insertEmbed(range.index, 'image', {
    alt: "",
    url: url,
  }, Quill.sources.USER);
  quill.setSelection(range.index + 1, Quill.sources.SILENT);
  $('#sidebar-controls').hide();
}











// quill editor add image handler
// quill.getModule("toolbar").addHandler("image", () => {
//   selectLocalImage();
// });



// Client side validation values

// Description should be 120+
// less than 150

// Title length 40+
// better if less than 70

// tagline 40 - 60

