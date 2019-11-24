/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
*/

let currentActiveSection; //use for storing current active section 
let currentUl = document.getElementById('navbar__list'); //getting current UL element array like
let sections = document.getElementsByTagName('section') //getting all sections 

// function to change active section, nav-menu link and scroll logic

function changeActiveSection(newSection, scrollLogic){

    let updateNewActiveSection = document.querySelectorAll(`[data-nav="${newSection}"]`);
    updateNewActiveSection[0].setAttribute('class','your-active-class');

    //remmove the previous active section
    let updateOldActiveSection = document.querySelectorAll(`[data-nav="${currentActiveSection}"]`);
    updateOldActiveSection[0].removeAttribute('class');

    //get id of the new active section
    let getClickedSectionId =  updateNewActiveSection[0].getAttribute('id'); //this will be used to update nav menu..           
    //make the newly clicked manu item active
    let updateNewActiveMenu = document.querySelectorAll(`[href="#${getClickedSectionId}"]`)
    updateNewActiveMenu[0].setAttribute('class','menu__link active');

    //get id of old active section
    let getOldActiveSectionId =  updateOldActiveSection[0].getAttribute('id'); //this will be used to update nav menu..
    //deactivate old menu item
    let updateOldActiveMenu = document.querySelectorAll(`[href="#${getOldActiveSectionId}"]`)
    updateOldActiveMenu[0].setAttribute('class','menu__link'); 

    //change the currentActiveSection
    currentActiveSection = newSection;  

    if(scrollLogic){
        //scroll logic
        let idToScrollTo = document.getElementById(getClickedSectionId);
        idToScrollTo.scrollIntoView({behavior: "smooth"});  
    }
    
}

// below creates dynamic nav menu
// loop through all sections part of the document
for (let i = 0; i < sections.length; i++){
    // create empty li element
    li = document.createElement('li');
    
    // create empty a tag
    a = document.createElement('a');
    
    
    if(sections.item(i).hasAttribute('id')){
        a.setAttribute('href',`#${sections.item(i).getAttribute('id')}`);  //assign href to the a tag
        a.setAttribute('onclick','return false;'); //need this to be disabled so that scroll behavior can work        
    }
    // below condition means it is acive section
    if(sections.item(i).hasAttribute('class')){
        a.setAttribute('class','menu__link active'); //if class attrib found then make nav manu active
        currentActiveSection = sections.item(i).getAttribute('data-nav');     
    } else {
        a.setAttribute('class','menu__link');
    }
    
    if(sections.item(i).hasAttribute('data-nav')){
        a.textContent = sections.item(i).getAttribute('data-nav');  // give text content based on data-nav value of a section
    }    
    
    li.appendChild(a); //append a tag to the li
    currentUl.appendChild(li); //append li to the ul
}


// event listener below which looks for event clicks happening on the manu links

let currentMenuLinks = document.getElementsByClassName('menu__link')


for (let i = 0; i < currentMenuLinks.length; i++){
    currentMenuLinks[i].addEventListener('click', function () {
      // console.log(this.getAttribute('href'));  just need inner text...
       if(this.innerText === currentActiveSection){
        // do not do anything if user clicks on same menu link as active one   
       } else {
           // update the active section of the article and nav-menu
           const scrollLogic = 1;
           changeActiveSection(this.innerText,scrollLogic);         
           
       }
    })
}

// scroll logic to make nav highlight when user scrolls manually
// getting height of the headers
let getHeaders = document.getElementsByTagName('header');
let headerHeight = 0;
for(const header of getHeaders) {
   headerHeight +=  header.scrollHeight;
}

//creating array for storing height of each sections
let sectionHeights = [];
let totalHeight = headerHeight;  // initializing first value with hearder height. 
for(const section of sections) {
    sectionHeights.push(totalHeight); //array getting populated
    totalHeight += section.scrollHeight;    
}     

// event listner on scroll event 
window.addEventListener('scroll', function(e) {
    for(let i = 0; i < sectionHeights.length; i++) {
        // below condition if array is on the last element
        if(i == (sectionHeights.length - 1)){
            if(document.documentElement.scrollTop > sectionHeights[i]){
                if(currentActiveSection !== sections[i].getAttribute('data-nav')){
                    console.log(`Make ${sections[i].getAttribute('data-nav')} active`);
                    changeActiveSection(sections[i].getAttribute('data-nav'),0);                    
                }                
            } 
        }else {
            if(document.documentElement.scrollTop > sectionHeights[i]  && document.documentElement.scrollTop < sectionHeights[i+1]){
                if(currentActiveSection !== sections[i].getAttribute('data-nav')){
                    console.log(`Make ${sections[i].getAttribute('data-nav')} active`);
                    changeActiveSection(sections[i].getAttribute('data-nav'),0);
                } 
            }   
        }
        
    }
})

