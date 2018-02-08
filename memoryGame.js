let previousChoice = [];
let pairedImgs = [];

let amountImages=30;  // amount of images currently in images folder
let imagePath="img/";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

/* Hides the images chosen since last successful match. */
function hideChoices() {
  for(let i=0; i<previousChoice.length; ++i) {
    hideImg(previousChoice[i]);
  }
}

/* Returns true if the previousChoice are of the same image. If not, false is returned */
function compareChoices() {
  return previousChoice[0].src === previousChoice[1].src
}

/*  Hides the element passed into it */
function hideImg(img) {
  img.style.display = 'none';
  img.classList.remove('flipped');
}

/*  Renders the element passed into it visible */
function showImg(img) {
  img.style.display = 'block';
  void img.offsetWidth; // trigger reflow
  img.classList.add("flipped");
}

function isVisible(img) {
  return img.style.display !== 'none';
}


/* Handles click on cells */
function chooseImg() {
  let img = this.firstElementChild;

  // if(same element already paired or first choice, do nothing.
  if((previousChoice.length==1 && previousChoice[0]===img) || pairedImgs.includes(img.src)){
    console.log("doing nothing");
    return;
  }

  console.log("doing something...?");

  // to match the pair ASAP
  if(previousChoice.length===1) {
    if(previousChoice[0].src===img.src){
      pairedImgs.push(img.src);
      previousChoice[0].classList.add('paired');  
      img.classList.add('paired');
    }
  }

  // if two choices have been made. Need to compare and handle if they're the same image.
  if(previousChoice.length===2) {
    console.log("3. choice made... comparing src of previous");
    if(!compareChoices()) {
      hideChoices();
    }
    previousChoice = [];
  }
  previousChoice.push(img);

  showImg(img);

  console.log("amountPairs: "+amountPairs);
  console.log("pairedImgs.length: "+pairedImgs.length);

  if(amountPairs===pairedImgs.length)
    window.setTimeout(alert("Congratulations!\nyou won the game :D"),5);
    
}

/* returns an array with the specified amount of random numbers in range. */
function getRandomNumbers(amountNumbers, from=Number.MIN_VALUE, to=Number.MAX_VALUE, unique=false) {
  let delta = to-from+1 ;
  let i =0, randomArr=[];
  while(randomArr.length<amountNumbers) {
    let random = Math.floor(Math.random()*delta) + from;
    if(unique && randomArr.includes(random))
      continue;
    randomArr.push(random);
  }
  return randomArr;
}


/* get random images from server returns the amount inputted */
function getRandomImageSrc(amount) {
  let imgs = [];
  let randomNumbers = getRandomNumbers(amount,1,amountImages,true);
  console.log(randomNumbers);
  for (let i in randomNumbers) {
    imgs.push(imagePath + randomNumbers[i] + ".png");
  }
  return imgs;
}

/* Function to find best  */
function findLeastSumFactors(amount)
{
  let middle = Math.floor(Math.sqrt(amount));
  do {
    if(amount%middle==0)
    {
      return [middle,amount/middle];
    }

  } while(--middle)

  return -1;
}


/* function returns a table with the specified width and heigth */
function createTable(amount) {
  let factors = findLeastSumFactors(amount);

  if(factors === -1)
  {
    console.log("no factors where found");
    return;
  }
    
  let height=factors[0];
  let width =factors[1];

  let table = document.createElement('table');
  // set an id for reference
  table.id = 'gameTable';
  let tbody = document.createElement('tbody');
  let row=null;
  for(let i=0; i<height; ++i) { // iterating over rows
    row = document.createElement('tr');
    for(let j=0; j<width; ++j) {  // iterating over cols
      row.appendChild(document.createElement('td')); // adding cell to table-row
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  return table;
}

/* add images to table... creates table if image doesn't exist
 * @images is an array with the immages
 * @table is the table. If null, a table with amountCol and amountRow
 * */
function addImageTable(images,table=null,amount) {
  if(table===null) {  // um talvan skal gerast
    table=createTable(amount);
  }
  console.log("creating images");
  let cells=table.getElementsByTagName('td');
  for (let i = 0, cell; cell = cells[i]; i++) {
    //iterate through cells
    //cells would be accessed using the "cell" variable assigned in the for loop
      let img = document.createElement('img');
      console.log("imageIndex: "+i);
      img.src = images[i];
      img.style.display='none';
      cell.appendChild(img);
      cell.addEventListener('click',chooseImg,false);
    }
  return table;
}

let amountPairs=0;


/* Prepares a new game. */
function prePareGame(amount) {
  /* choosing random images from imageFolder */
  amountPairs = amount/2;
  console.log("Getting "+amountPairs+" images");  
  let imgs = getRandomImageSrc(amountPairs);
  console.log(imgs);
  imgs = imgs.concat(imgs); // create array with two of every image
  shuffleArray(imgs);

  /* prepares table. Adds images into it */
  let table = addImageTable(imgs,null,amount);

  let gameTable = document.getElementById('gameTable')
  if(!!gameTable) {
    console.log("gameTable exists!");
    gameTable.parentNode.replaceChild(table,gameTable);
  }
  else {
    console.log("gameTable exists not!");
    document.getElementById('gameDiv').appendChild(table);
  }
}


function prepareInput() {
  let amount = parseInt(document.getElementById("amount").value);

  let neededImages = amount*2;

  if(neededImages%2!==0) {
    alert("Can't work with odd number of cards!");
    return;
  }

  if(neededImages > amountImages*2){
    alert("Not enough images on server to accomodate")
    return;
  }
  prePareGame(neededImages);
}
