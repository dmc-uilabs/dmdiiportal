<?php
function sortByTitleASC($a, $b) {
    return $a['title'] - $b['title'];
}
function sortByStatusASC($a, $b) {
    return $a['currentStatus']['percentCompleted'] - $b['currentStatus']['percentCompleted'];
}
function sortByProjectASC($a, $b) {
    return $a['currentStatus']['project']['title'] - $b['currentStatus']['project']['title'];
}
function sortByProjectTaskASC($a, $b) {
    return $a['project']['title'] - $b['project']['title'];
}
function sortByStartASC($a, $b) {
    return strtotime($a['currentStatus']['startDate'].' '.$b['currentStatus']['startTime']) > strtotime($b['currentStatus']['startDate'].' '.$b['currentStatus']['startTime']) ? 1 : -1;
}
function sortByDueDateASC($a, $b) {
    return strtotime($a['dueDate']) > strtotime($b['dueDate']) ? 1 : -1;
}
function sortByCreatedAtASC($a, $b){
    return strtotime($a['created_at']) > strtotime($b['created_at']) ? 1 : -1;
}
function sortByPriorityASC($a, $b) {
    return convertPriority($a['priority']) > convertPriority($b['priority']) ? 1 : -1;
}
function sortByReleaseDateASC($a, $b) {
    return strtotime($a['releaseDate']) > strtotime($b['releaseDate']) ? 1 : -1;
}


function sortByTitleDESC($a, $b) {
    return $b['title'] - $a['title'];
}
function sortByStatusDESC($a, $b) {
    return $b['currentStatus']['percentCompleted'] - $a['currentStatus']['percentCompleted'];
}
function sortByProjectDESC($a, $b) {
    return $b['currentStatus']['project']['title'] - $a['currentStatus']['project']['title'];
}
function sortByProjectTaskDESC($a, $b) {
    return $b['project']['title'] - $a['project']['title'];
}
function sortByStartDESC($a, $b) {
    return strtotime($b['currentStatus']['startDate'].' '.$b['currentStatus']['startTime']) > strtotime($a['currentStatus']['startDate'].' '.$b['currentStatus']['startTime']) ? 1 : -1;
}
function sortByDueDateDESC($a, $b) {
    return strtotime($b['dueDate']) > strtotime($a['dueDate']) ? 1 : -1;
}
function sortByCreatedAtDESC($a, $b){
    return strtotime($b['created_at']) > strtotime($a['created_at']) ? 1 : -1;
}
function sortByPriorityDESC($a, $b) {
    return convertPriority($b['priority']) > convertPriority($a['priority']) ? 1 : -1;
}
function sortByReleaseDateDESC($a, $b) {
    return strtotime($b['releaseDate']) > strtotime($a['releaseDate']) ? 1 : -1;
}

function sortByReviewDateDESC($a, $b) {
  return strtotime($b['date']) > strtotime($a['date']) ? 1 : -1;
}

function sortByReviewDateASC($a, $b) {
  return strtotime($a['date']) > strtotime($b['date']) ? 1 : -1;
}

function sortByReviewRatingDESC($a, $b) {
  return $b['rating'] - $a['rating'];
}

function sortByReviewRatingASC($a, $b) {
  return $a['rating'] - $b['rating'];
}

function sortByReviewVerifiedASC($a, $b) {
  return $a['status'] - $b['status'];
}


function convertPriority($date){
    if($date === 'Urgent'){
        return 999999999999;
    }else if($date === 'Today'){
        return 999999999998;
    }else{
        return strtotime($date);
    }
}

?>