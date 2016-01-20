<?php


function add_discussion_like_dislike($params){
    $review = json_decode(httpResponse(dbUrl().'/individual-discussion-comment/'.$params['commentId'], null, null),true);
    $review['like'] = $params['like'];
    $review['dislike'] = $params['dislike'];
    $review['userRatingReview'][$params['userLogin']] = $params['ratingComment'];
    $data = json_encode($review);
    json_decode(httpResponse(dbUrl().'/individual-discussion-comment/'.$params['commentId'], 'PUT', $data),true);
    return json_encode($data);
}

?>

