const includeQuotas = (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    attributes: ['id', 'title', 'date'],
    distinct: true,
    // Include quotas of event and count of signups
    include: [{
      model: sequelize.models.quota,
      attributes: [
        'title',
        'size',
        'signupOpens',
        'signupCloses',
        [sequelize.fn('COUNT', sequelize.col('quota.signups.id')), 'signupCount'],
      ],
      include: [{
        model: sequelize.models.signup,
        attributes: [],
      }],
    }],
    group: [sequelize.col('event.id'), sequelize.col('quota.id')],
  };
};


const includeAllEventData = (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    distinct: true,
    include: [
      // First include all questions (also non-public for the form)
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size', 'signupOpens', 'signupCloses'],
        model: sequelize.models.quota,
        // ... and signups of quotas
        include: [{
          attributes: ['firstName', 'lastName'],
          model: sequelize.models.signup,
          // ... and answers of signups
          include: [{
            attributes: ['questionId', 'answer'],
            model: sequelize.models.answer,
            // ... but only public ones
            include: [{
              model: sequelize.models.question,
              attributes: [],
              where: { public: true },
              required: false,
            }],
          }],
        }],
      },
    ],
  };
};

exports.before = {
  all: [],
  find: [includeQuotas],
  get: [includeAllEventData],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};