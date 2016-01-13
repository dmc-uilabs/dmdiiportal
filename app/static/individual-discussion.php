<?php

function get_individual_discussion($params){
	if(isset($params['all'])){
		$discussion = json_decode(httpResponse(dbUrl() . '/individual-discussion', null, null), true);
	} else {
 	    $discussion = json_decode(httpResponse(dbUrl() . '/individual-discussion/' . $params['id'], null, null), true);
	    $discussion["comments"] = json_decode(httpResponse(dbUrl() . $discussion["comments"]["link"], null, null), true);
	}
    
    return json_encode(array('result' => $discussion));
}

function add_comment_individual_discussion($params){
    $last = json_decode(httpResponse(dbUrl().'/individual-discussion-comment?_sort=id&_order=DESC&_limit=1', null, null),true);
  if(count($last) > 0){
    $id = $last[0]['id']+1;
  }else{
    $id = 1;
  }

    $discussion = json_decode(httpResponse(dbUrl().'/individual-discussion/'.$params['discussionId'], null, null),true);
    $discussion['comments']['totalItems'] = $discussion['comments']['totalItems'] + 1;
    $data = json_encode($discussion);
    json_decode(httpResponse(dbUrl().'/individual-discussion/'.$params['discussionId'], 'PUT', $data),true);


  $data = json_encode(array(
      "id" => $id,
      "individual-discussionId" => $params['discussionId'],
      "full_name" => $params['name'],
      "create_at" => date("d/m/Y h:i A"),
      "avatar" => $params['avatar'],
      "userRatingReview" => array("DMC Member" => "none"),
      "like" => 0,
      "dislike" => 0,
      "text" => $params['comment']
  ));
  $comment = json_decode(httpResponse(dbUrl().'/individual-discussion-comment', 'POST', $data),true);
  return json_encode($comment);
}

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

