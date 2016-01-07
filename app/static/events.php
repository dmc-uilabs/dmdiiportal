<?php

function get_events($params){
    $offset = (isset($params["offset"]) ? $params["offset"] : 0);
    $limit = (isset($params["limit"]) ? $params["limit"] : 10);
    $events = json_decode(httpResponse(dbUrl() . '/events?_sort=date&_order=ASC&_limit='.$limit.'&_start='.$offset, null, null), true);
    $totalCount = count(json_decode(httpResponse(dbUrl() . '/events', null, null), true));
    return json_encode(array('result' => $events, 'count' => $totalCount));
}

?>

