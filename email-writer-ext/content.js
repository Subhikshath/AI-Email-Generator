// console.log("Email Writer Extension - Content Script Loaded");


// function  createAIButton() {
//   const button = document.createElement('div');
//   button.className = 'T-J  J-J5-Ji aoO v7 T-I-atl L3';
//   button.style.marginRight = '8px';
//   button.innerHTML = 'AI Reply';
//   button.setAttribute('role', 'button');
//   button.setAttribute('date-tooltip','Generate AI Reply');
//   return button;
// }
// function getEmailContent() {
// const selectors =[
//     '.h7',
//     '.a3s.aiL',
//     '.gmail_quote',
//     '[role = "presentation"]'
//   ];
//   for(const selector in selectors){
//    const content = document.querySelector(selector);
//    if(content){
//     return content.innerText.trim();
//    }
//    return '';
// }
// }


// function findComposeToolbar() {
// const selectors =[
//     '.btc',
//     '.aDh',
//     '[role="toolbar"]',
//     '.gU.Up'
//   ];
//   for(const selector of selectors){
//    const toolbar = document.querySelector(selector);
//    if(toolbar){
//     return toolbar;
//    }
//    return null;
// }
// }


// function injectButton() {
//   const existingButton = document.querySelector('.ai-reply-button');

//   if(existingButton) {
//     existingButton.remove();
//   }


// const toolbar = findComposeToolbar();
// if(!toolbar){
//   console.log("Toolbar not found");
//   return;
// }
//   console.log("Toolbar found, Creating AI button");
//   const button = createAIButton();
//   button.classList.add('ai-reply-button');

//   button.addEventListener('click',async() =>{
//     try{
//       button.innerHTML = 'Generaating...';
//       button.disabled = true;

//       const emailContent = getEmailContent();
//       await fetch('http://localhost:8080/api/email/generate',{
//         method : 'POST',
//         headers :{
//           'Content-Type': 'application/json',
//         },
//         body:JSON.stringify({
          
//   emailContent: emailContent,
//   tone: "professional"

//         })
//       });
//       if(!response.ok){
//         throw new Error('API Request Failed');
//       }
//        const generatedReply = await Response.text();
//        const composeBox = document.querySelector('[role = "textbox"][g_editable = "true]');
//        if(composeBox){
//         composeBox.focus();
//         document.execCommand('insertText',false,generatedReply);
//         }
//         else{
//           console.log("Compose box was not found");
//         }
//     }catch(error){
//       console.log(error);
//       alert("Failed to generate AI reply");
//     }
// finally{
//   button.innerHTML = 'AI Reply';
//   button.disabled = false;
// }
//   });
//   toolbar.insertBefore(button,toolbar.firstChild);
// }

// const observer = new MutationObserver((mutations) => {
//   for (const mutationn of mutations) {
//     const addedNodes = Array.from(mutationn.addedNodes);
//     const hasComposeElements = addedNodes.some(
//       (node) =>
//         node.nodeType === Node.ELEMENT_NODE &&
//         (node.matches('.aDh,.btC, [role = "dialog') ||
//           node.querySelector('.aDh,.btC, [role = "dialog')),
//     );

//     if (hasComposeElements) {
//       console.log("Compose Window Detector");
//       setTimeout(injectButton, 500);
//     }
//   }
// });

// observer.observe(document.body, {
//    childList: true, 
//    subtree: true 
//   });















console.log("Email Writer Extension - Content Script Loaded");

/* =========================
   CREATE AI BUTTON
========================= */
function createAIButton() {
  const button = document.createElement('button');

  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 T-I-Js-Gs';
  button.innerHTML = '✨ AI Reply';

  button.style.marginLeft = '8px';
  button.style.cursor = 'pointer';

  button.setAttribute('type', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');

  return button;
}

/* =========================
   GET EMAIL CONTENT
========================= */
function getEmailContent() {
  const selectors = [
    '.h7',
    '.a3s.aiL',
    '.gmail_quote',
    '[role="presentation"]'
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return '';
}

/* =========================
   FIND TOOLBAR (IMPORTANT)
========================= */
function findComposeToolbar() {
  return document.querySelector('.btC'); // BEST selector for Gmail toolbar
}

/* =========================
   INSERT GENERATED TEXT
========================= */
function insertIntoComposeBox(text) {
  const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

  if (!composeBox) {
    console.log("Compose box not found");
    return;
  }

  composeBox.focus();

  // Modern way (better than execCommand)
  document.execCommand('insertText', false, text);
}

/* =========================
   INJECT BUTTON
========================= */
function injectButton() {
  const toolbar = findComposeToolbar();

  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  // Prevent duplicate button
  if (toolbar.querySelector('.ai-reply-button')) {
    return;
  }

  console.log("Toolbar found → Injecting button");

  const button = createAIButton();
  button.classList.add('ai-reply-button');

  button.addEventListener('click', async () => {
    try {
      button.innerHTML = '⏳ Generating...';
      button.disabled = true;

      const emailContent = getEmailContent();

      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional"
        })
      });

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const generatedReply = await response.text();

      insertIntoComposeBox(generatedReply);

    } catch (error) {
      console.error(error);
      alert("Failed to generate AI reply");
    } finally {
      button.innerHTML = '✨ AI Reply';
      button.disabled = false;
    }
  });

  // Append at end (correct alignment)
  toolbar.appendChild(button);
}

/* =========================
   OBSERVER (AUTO DETECT)
========================= */
const observer = new MutationObserver(() => {
  injectButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});