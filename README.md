# Quiz

id
title
description

# Question

id
quizId
description
score # 5 / 15 / 25

# Answer

id
questionId
description
isRightAnswer Boolean

# Submission

id
userId
quizId
result
createdAt

# SubmissionQuestionAnswer

## We create this as soon as the question appears to the user during the quiz

id
submissionId
questionId
answerId # NULLABLE as the time can expire and the answer will be null
createdAt # Used to expire question timer