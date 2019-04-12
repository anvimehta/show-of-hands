import moment from 'moment';

// Get visible expenses

export default (polls, o) => {

  if(!o){
    return polls.polls;
  }

  const IS_TRENDING_POLL_MIN = 2;
  const getPollTrendingIndex = p => {
    const timeDelta = (new Date().getTime() - (p.start_date || 0)) / (24 * 60 * 60 * 1000)
    if (timeDelta > 5) {
      return -1
    }

    const trendingIndex = Object.keys(p.responses || {}).length / timeDelta
    console.log(trendingIndex)
    return trendingIndex;
  }

  const { category, text, sortBy, startDate, endDate, pollStatus } = o;

  return polls.polls.filter((poll) => {
    const createdAtMoment = moment(poll.start_date);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
    const textMatch = poll.title.toLowerCase().includes(text.toLowerCase());
    const categoryMatch = category ? +poll.category === +category : true
    const pollStatusMatch = pollStatus ? pollStatus === "INACTIVE" ? poll.end_date < new Date().getTime() : poll.end_date > new Date().getTime() : true
    const isTrendingMatch = pollStatus === "TRENDING" ? getPollTrendingIndex(poll) > IS_TRENDING_POLL_MIN : true
    return startDateMatch && endDateMatch && textMatch && categoryMatch && pollStatusMatch && isTrendingMatch;
  }).sort((a, b) => {

      switch (sortBy) {

        case "NUMBER_OF_RESPONSES_ASC":
          return a.response_count < b.response_count ? -1 : 1;

        case "NUMBER_OF_RESPONSES_DESC":
          return a.response_count > b.response_count ? -1 : 1;

        case "NUMBER_OF_LIKES_ASC":
          return a.like_count < b.like_count ? -1 : 1;

        case "NUMBER_OF_LIKES_DESC":
          return a.like_count > b.like_count ? -1 : 1;
      }
  });
};
