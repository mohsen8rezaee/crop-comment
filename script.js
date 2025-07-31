const textAreaElement = document.querySelector(".form__textarea");
const counter = document.querySelector(".counter");
const submitBtn = document.querySelector(".submit-btn__text");
const form = document.querySelector(".form");
const feedElement = document.querySelector(".feedbacks");
const feedbackElement=document.querySelector(".feedback");
const base_API_URL = 'https://bytegrad.com/course-assets/js/1/api';
const hashtagListElement = document.querySelector(".hashtags");
document.addEventListener('DOMContentLoaded', function () {
    try {
        // alert("hello")
        fetch(`${base_API_URL}/feedbacks`)
            .then(Response => { return Response.json() })
            .then(data => {
                document.querySelector(".spinner").classList.remove("spinner")
                data.feedbacks.forEach(feed => {
                    generateFeedback(feed);
                });
                console.log('Data loaded:', data);

            })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.json();
        // پردازش داده‌ها اینجا انجام شود
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// input handle start
function inputHandler() {
    const textAreaLength = textAreaElement.value.length;
    const maxLengthText = 150;
    const textLength = maxLengthText - textAreaLength;
    counter.textContent = textLength;
}
// input handle end
function generateFeedback(feedback) {
    const feedbackItem = `
    <li class="feedback">
   <button class="upvote">
       <i class="upvote__icon"></i>
       <span class="upvote__count">${feedback.upvoteCount}</span>
   </button>                           
   <section class="feedback__badge">
       <p class="feedback__letter">${feedback.badgeLetter}</p>
   </section>
   <div class="feedback__content">
       <p class="feedback__company">${feedback.company}</p>
       <p class="feedback__text">${feedback.text}</p>
   </div>
   <p class="feedback__date">${feedback.daysAgo === 0 ? "New" : feedback.daysAgo}</p>
   </li> 
   `;



    feedElement.insertAdjacentHTML("beforeend", feedbackItem);
}
// submit handle start
function submitHandler(event) {
    event.preventDefault();

    if (textAreaElement.value.includes("#") && textAreaElement.value.length > 5) {
        addClass("form--valid");
        removeClass("form--valid")
    } else {
        addClass("form--invalid");
        removeClass("form--invalid");
        textAreaElement.focus();
        return;
    }
    const Hashtag = textAreaElement.value.split(' ').find(word => word.includes("#"));
    const company = Hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const dayAgo = 0;
    const feed = {
        company: company,
        badgeLetter: badgeLetter,
        upvoteCount: upvoteCount,
        daysAgo: dayAgo,
        text: textAreaElement.value
    }
    generateFeedback(feed);
    submitBtn.blur();
    textAreaElement.value = '';
    counter.textContent = 150;
    fetch(`${base_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(feed),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("success");
            } else {
                console.log("wrong");
            }
        })

}
// submit handle end
function clickHandler(event) {
    const clickedElement = event.target;
    const upvoteElement = clickedElement.className.includes('upvote');
    if (upvoteElement) {
        const upvoteBtn = clickedElement.closest(".upvote");
        upvoteBtn.disabled = true;
        const upvoteCountElement = upvoteBtn.querySelector(".upvote__count");
        let upvoteCount = +upvoteBtn.textContent;
        upvoteCountElement.textContent = upvoteCount + 1;

    } else {
        clickedElement.closest(".feedback").classList.toggle("feedback--expand");
    }
}
function filterByHashtag(event){
    const clickedElement = event.target;
    if (clickedElement.ClassName === 'hashtags') {
        return
    }
    const companyNameFromHashtag = clickedElement.textContent.substring(1).trim();
    feedElement.childNodes.forEach(childNode  => {
        if (childNode.nodeType === 3) {
            return
        }
        const companyNameFromFeedbackItems = childNode.querySelector(".feedback__company").textContent.toUpperCase().trim();
        if (companyNameFromHashtag.toUpperCase() !== companyNameFromFeedbackItems) {
            childNode.remove();
        }
    })
}
// remove/add class start
function removeClass(ClassName) {
    setTimeout(() => { form.classList.remove(ClassName) }, 2000)

}
function addClass(ClassName) {
    form.classList.add(ClassName);
}
// remove/add class end

submitBtn.addEventListener("click", submitHandler);
textAreaElement.addEventListener("input", inputHandler);
feedElement.addEventListener("click", clickHandler);
hashtagListElement.addEventListener("click",filterByHashtag);