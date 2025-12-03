// Config dosyasından ayarları yükle
let config = {
    siteTitle: "Sevgili Testi",
    siteSubtitle: "Sevgilin hakkında ne kadar biliyorsun? Hadi test edelim!",
    footerText: "Sevgiyle yapıldı ❤️"
};

// Sorular ve cevaplar
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let questionCount = 10;
let shareLink = '';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async function() {
    await loadConfig();
    updateVisitorCount();
    
    // URL parametrelerinden soruları yükle
    const urlParams = new URLSearchParams(window.location.search);
    const quizData = urlParams.get('quiz');
    
    if (quizData) {
        // URL'den soruları yükle ve direkt teste başla
        try {
            const decoded = decodeURIComponent(quizData);
            questions = JSON.parse(atob(decoded));
            startQuiz();
        } catch (e) {
            console.error('URL\'den sorular yüklenirken hata:', e);
            loadQuestionsFromStorage();
        }
    } else {
        loadQuestionsFromStorage();
    }
    
    setupEventListeners();
    checkIfQuestionsExist();
});

// Ziyaretçi sayısını güncelle
function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = 0;
    }
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    
    const visitorElement = document.getElementById('visitor-count');
    if (visitorElement) {
        visitorElement.textContent = count;
    }
}

// Config dosyasını yükle
async function loadConfig() {
    try {
        const response = await fetch('config.txt');
        const text = await response.text();
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && trimmed.includes('=')) {
                const [key, ...valueParts] = trimmed.split('=');
                const value = valueParts.join('=').trim();
                
                if (key.trim() === 'siteTitle') {
                    config.siteTitle = value;
                } else if (key.trim() === 'siteSubtitle') {
                    config.siteSubtitle = value;
                } else if (key.trim() === 'footerText') {
                    config.footerText = value;
                }
            }
        });
        
        updateUI();
    } catch (error) {
        console.log('Config dosyası yüklenemedi, varsayılan değerler kullanılıyor.');
    }
}

// UI'ı güncelle
function updateUI() {
    const titleElement = document.getElementById('site-title');
    const subtitleElement = document.getElementById('site-subtitle');
    const footerElement = document.getElementById('footer-text');
    
    if (titleElement) titleElement.textContent = config.siteTitle;
    if (subtitleElement) subtitleElement.textContent = config.siteSubtitle;
    if (footerElement) footerElement.textContent = config.footerText;
    
    // Sayfa başlığını da güncelle
    document.title = config.siteTitle;
}

// LocalStorage'dan soruları yükle
function loadQuestionsFromStorage() {
    const savedQuestions = localStorage.getItem('quizQuestions');
    if (savedQuestions) {
        try {
            questions = JSON.parse(savedQuestions);
        } catch (e) {
            console.error('Sorular yüklenirken hata oluştu:', e);
            questions = [];
        }
    }
}

// Soruların olup olmadığını kontrol et
function checkIfQuestionsExist() {
    if (questions.length === 0) {
        // Soru yoksa, Teste Başla butonunu devre dışı bırak veya uyarı göster
        const startButton = document.querySelector('#start-screen .btn-secondary');
        if (startButton) {
            startButton.style.opacity = '0.5';
            startButton.style.cursor = 'not-allowed';
            startButton.onclick = function() {
                alert('Önce test hazırlamanız gerekiyor! Lütfen "Test Hazırla" butonuna tıklayın.');
            };
        }
    }
}

// Soru hazırlama ekranını göster
function showCreateScreen() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('create-screen').classList.add('active');
    
    // Varsayılan soru sayısını yükle
    const savedCount = localStorage.getItem('questionCount');
    if (savedCount) {
        questionCount = parseInt(savedCount);
        document.getElementById('question-count-select').value = questionCount;
    }
    
    renderQuestions();
}

// Soru sayısını güncelle
function updateQuestionCount() {
    questionCount = parseInt(document.getElementById('question-count-select').value);
    renderQuestions();
}

// Soruları render et
function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    for (let i = 0; i < questionCount; i++) {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <div class="question-item-header">
                <span class="question-item-number">Soru ${i + 1}</span>
            </div>
            <div class="question-input-group">
                <label>Soru Metni:</label>
                <textarea id="question-${i}" placeholder="Örn: Sevgilinin en sevdiği renk nedir?" rows="2"></textarea>
            </div>
            <div class="question-input-group">
                <label>Doğru Cevap:</label>
                <input type="text" id="answer-${i}" placeholder="Örn: pembe">
            </div>
            <div class="question-input-group">
                <label>İpucu (İsteğe Bağlı):</label>
                <input type="text" id="hint-${i}" placeholder="Örn: Bir renk düşün...">
            </div>
        `;
        container.appendChild(questionItem);
        
        // Eğer kayıtlı soru varsa, doldur
        if (questions[i]) {
            document.getElementById(`question-${i}`).value = questions[i].question || '';
            document.getElementById(`answer-${i}`).value = questions[i].answer || '';
            document.getElementById(`hint-${i}`).value = questions[i].hint || '';
        }
    }
}

// Soruları kaydet ve link oluştur
function saveQuestions() {
    const newQuestions = [];
    let hasError = false;
    
    for (let i = 0; i < questionCount; i++) {
        const question = document.getElementById(`question-${i}`).value.trim();
        const answer = document.getElementById(`answer-${i}`).value.trim();
        const hint = document.getElementById(`hint-${i}`).value.trim();
        
        if (!question || !answer) {
            alert(`Soru ${i + 1} için soru metni ve cevap zorunludur!`);
            hasError = true;
            break;
        }
        
        newQuestions.push({
            question: question,
            answer: answer,
            points: 10,
            hint: hint || ''
        });
    }
    
    if (!hasError) {
        questions = newQuestions;
        localStorage.setItem('quizQuestions', JSON.stringify(questions));
        localStorage.setItem('questionCount', questionCount);
        
        // Link oluştur
        createShareLink();
        
        // Paylaşma ekranını göster
        showShareScreen();
    }
}

// Paylaşma linki oluştur
function createShareLink() {
    try {
        const questionsJson = JSON.stringify(questions);
        const encoded = btoa(questionsJson);
        const baseUrl = window.location.origin + window.location.pathname;
        shareLink = `${baseUrl}?quiz=${encodeURIComponent(encoded)}`;
        
        const shareLinkInput = document.getElementById('share-link');
        if (shareLinkInput) {
            shareLinkInput.value = shareLink;
        }
    } catch (e) {
        console.error('Link oluşturulurken hata:', e);
        alert('Link oluşturulurken bir hata oluştu.');
    }
}

// Paylaşma ekranını göster
function showShareScreen() {
    document.getElementById('create-screen').classList.remove('active');
    document.getElementById('share-screen').classList.add('active');
    
    // Teste Başla butonunu aktif et
    const startButton = document.querySelector('#start-screen .btn-secondary');
    if (startButton) {
        startButton.style.opacity = '1';
        startButton.style.cursor = 'pointer';
        startButton.onclick = startQuiz;
    }
}

// Linki kopyala
function copyLink() {
    const shareLinkInput = document.getElementById('share-link');
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // Mobil için
    
    try {
        document.execCommand('copy');
        alert('✅ Link kopyalandı! Şimdi sevgiline gönderebilirsin.');
    } catch (err) {
        // Modern yöntem
        navigator.clipboard.writeText(shareLink).then(() => {
            alert('✅ Link kopyalandı! Şimdi sevgiline gönderebilirsin.');
        }).catch(() => {
            alert('Link kopyalanamadı. Lütfen manuel olarak kopyalayın.');
        });
    }
}

// WhatsApp ile paylaş
function shareWhatsApp() {
    const text = `💕 Sevgili Testi! Bu testi çöz ve ne kadar iyi tanıdığını görelim: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Telegram ile paylaş
function shareTelegram() {
    const text = `💕 Sevgili Testi! Bu testi çöz ve ne kadar iyi tanıdığını görelim: ${shareLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`, '_blank');
}

// Test et (önizleme)
function testQuiz() {
    document.getElementById('share-screen').classList.remove('active');
    startQuiz();
}

// Başlangıç ekranına dön
function goToStart() {
    document.getElementById('create-screen').classList.remove('active');
    document.getElementById('share-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    
    // URL parametrelerini temizle
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Direkt başlat
function startQuizDirect() {
    if (questions.length === 0) {
        alert('Önce test hazırlamanız gerekiyor! Lütfen "Test Hazırla" butonuna tıklayın.');
        return;
    }
    startQuiz();
}

// Event listener'ları ayarla
function setupEventListeners() {
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });
    }
}

// Quiz'i başlat
function startQuiz() {
    if (questions.length === 0) {
        alert('Önce test hazırlamanız gerekiyor! Lütfen "Test Hazırla" butonuna tıklayın.');
        return;
    }
    
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('create-screen').classList.remove('active');
    document.getElementById('share-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.add('active');
    
    showQuestion();
}

// Soruyu göster
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('answer-input').value = '';
    document.getElementById('hint-text').textContent = question.hint || '';
    document.getElementById('answer-input').focus();
    
    // İlerleme çubuğunu güncelle
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Soru numarasını güncelle
    document.getElementById('question-number').textContent = 
        `Soru ${currentQuestionIndex + 1} / ${questions.length}`;
    
    // Puanı güncelle
    document.getElementById('current-score').textContent = score;
}

// Cevabı gönder
function submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value.trim().toLowerCase();
    
    if (!userAnswer) {
        alert('Lütfen bir cevap girin!');
        return;
    }
    
    const question = questions[currentQuestionIndex];
    const correctAnswer = question.answer.toLowerCase();
    
    // Cevabı kontrol et (kısmi eşleşme de kabul edilir)
    let isCorrect = false;
    if (userAnswer === correctAnswer) {
        isCorrect = true;
    } else if (correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)) {
        // Kısmi eşleşme kontrolü
        isCorrect = true;
    }
    
    if (isCorrect) {
        score += question.points;
        correctAnswers++;
        answerInput.style.borderColor = '#4caf50';
        answerInput.style.backgroundColor = '#e8f5e9';
        
        setTimeout(() => {
            answerInput.style.borderColor = '';
            answerInput.style.backgroundColor = '';
            nextQuestion();
        }, 500);
    } else {
        wrongAnswers++;
        answerInput.style.borderColor = '#f44336';
        answerInput.style.backgroundColor = '#ffebee';
        
        setTimeout(() => {
            answerInput.style.borderColor = '';
            answerInput.style.backgroundColor = '';
            nextQuestion();
        }, 1000);
    }
}

// Sonraki soruya geç
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// Sonuçları göster
function showResults() {
    document.getElementById('quiz-screen').classList.remove('active');
    document.getElementById('result-screen').classList.add('active');
    
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('score-percentage').textContent = `%${percentage}`;
    document.getElementById('correct-count').textContent = correctAnswers;
    document.getElementById('wrong-count').textContent = wrongAnswers;
    document.getElementById('total-questions').textContent = questions.length;
    document.getElementById('total-score').textContent = score;
    
    // Sonuç mesajını belirle
    let message = '';
    let icon = '🎉';
    
    if (percentage >= 90) {
        message = 'Mükemmel! Sevgilini çok iyi tanıyorsun! 💕';
        icon = '🏆';
    } else if (percentage >= 70) {
        message = 'Harika! Sevgilini iyi tanıyorsun! 💖';
        icon = '⭐';
    } else if (percentage >= 50) {
        message = 'İyi! Ama daha fazla öğrenmen gerekiyor! 💝';
        icon = '😊';
    } else {
        message = 'Sevgilini daha iyi tanımalısın! Birlikte daha fazla vakit geçirin! 💗';
        icon = '💌';
    }
    
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-icon').textContent = icon;
}

// Quiz'i yeniden başlat
function restartQuiz() {
    document.getElementById('result-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
    
    // URL parametrelerini temizle
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
