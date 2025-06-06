const quiz = require('../quiz');

test('問題数が期待通りであること', () => {
  expect(quiz.length).toBe(10);
});

test('各問題の answerIndex が正しい選択肢を指していること', () => {
  quiz.forEach(q => {
    const answer = q.choices[q.answerIndex];
    expect(answer).toBeDefined();
  });
});
