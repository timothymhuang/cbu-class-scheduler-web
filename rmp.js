const ratings = require('@mtucourses/rate-my-professors').default

(async () => {
  const teachers = await ratings.searchTeacher('Mario Oyanader California Baptist University');
  const teacherId = teachers[0].id;
  const teacher = await ratings.getTeacher(teacherId);
  const avgScore = teacher.avgRating;
  console.log(avgScore); // 4.8
})();
