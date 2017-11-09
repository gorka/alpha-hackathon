const TONES = {
  anger: '😤',
  fear: '😱',
  joy: '😁',
  sadness: '☹️',
  analytical: '🤓',
  confident: '😎',
  tentative: '🤔'
}

const forms = document.querySelectorAll('[target="tweet-post-iframe"]');

forms.forEach(form => {
  const counter = form.querySelector('.TweetBoxUploadProgress');
  counter.insertAdjacentHTML('beforebegin',
    '<span id="emotions" class="TweetBoxExtras-item"></span>'
  );

  // add listeners to tweet textareas:
  form.querySelectorAll('[name="tweet"]').forEach(tweet => {
    tweet.addEventListener('input', (e) => {
      if (e.data === " ") fetchEmotion(e.target.textContent, form);
    });
  });

  // add listeners to form send:
  const button = form.querySelector('button.tweet-action')
  button.addEventListener('click', () => {
    const tweet = button.parentElement.parentElement.parentElement.querySelector('[name="tweet"]').textContent;
    sendEmotion(tweet, form);
  })
});


function fetchEmotion(text, form) {
  apiEmotion({
    text,
    sent: false
  }, (data) => {
    setEmotions(data.tones)
  });
}

function sendEmotion(text, form) {
  apiEmotion({
    text,
    sent: true
  }, () => setEmotions([]))
}

function apiEmotion(data, callback) {
  jQuery.post('https://agile-fjord-58944.herokuapp.com/api/inputs', {
    content: data.text,
    application: 'twitter',
    client_type: 'chrome-extension',
    user_id: 3,
    sent: data.sent
  })
  .done(data => callback(data))
  .fail(error => console.log(error))
}

function tonesToEmojis(tones) {
  return tones.reduce((acc, current) => {
    return acc.concat(TONES[current])
  }, []);
}


function setEmotions(tones) {
  const text = tones.length > 0
    ? `
        Mood: <span style="font-size: 1.6em">
          ${ tonesToEmojis(tones).join(" ") }
        </span>
      `
    : '';
  
  document.getElementById('emotions').innerHTML = text;
}