<?php

function get_announcements($params){
    $offset = (isset($params["offset"]) ? $params["offset"] : 0);
    $limit = (isset($params["limit"]) ? $params["limit"] : 10);
    $announcements = json_decode(httpResponse(dbUrl() . '/announcements?_sort=created_at&_order=ASC&_limit='.$limit.'&_start='.$offset, null, null), true);
    $count = count($announcements);
    for($i = 0; $i < $count; ++$i) {
        $announcements[$i]["comments"] = count(json_decode(httpResponse(dbUrl() . '/announcements/'.$announcements[$i]["id"].'/announcement_comments', null, null), true));
    }
    $totalCount = count(json_decode(httpResponse(dbUrl() . '/announcements', null, null), true));
    return json_encode(array('result' => $announcements, 'count' => $totalCount));
}

?>

