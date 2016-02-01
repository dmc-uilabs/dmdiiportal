<?php
include __DIR__.'/http.php';
include __DIR__.'/functions.php';
include __DIR__.'/db.php';
include __DIR__.'/individual-discussion.php';

//use ElephantIO\Client,ElephantIO\Engine\SocketIO\Version1X;
//require __DIR__ . '/vendor/autoload.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
date_default_timezone_set('America/New_York');

return call_user_func(function () {

	$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
	$publicDir = __DIR__ . '/';
	$uri = urldecode($uri);
	$uri = str_replace('/static', '', $uri);
	$requested = $publicDir . '/' . $uri;
	if(isset($_GET['p'])){
		$uri = $_GET['p'];
	}else{
		$uri = '/';
	}
	if ($uri === '/'){
		echo json_encode(array('result' =>  array()));
	}else if(strpos($uri, '/services') !== false){
		echo get_services($_GET);
	}else if(strpos($uri,'/change_service') !== false){
		echo edit_service($_POST);
	}else if(strpos($uri,'/tasks') !== false){
		echo get_tasks($_GET);
	}else if(strpos($uri,'/change_tasks') !== false){
		echo edit_task($_POST);
	}else if(strpos($uri,'/discussions') !== false){
		echo get_discussions($_GET);
	}else if(strpos($uri,'/projects') !== false) {
		echo get_projects($_GET);
	}else if(strpos($uri,'/companies') !== false){
		echo get_company($_GET);
	}else if(strpos($uri,'/company_reviews') !== false){
		echo get_company_review($_GET);
	}else if(strpos($uri,'/add_review_company') !== false){
		echo add_company_review($_POST);
	}else if(strpos($uri,'/get_account') !== false){
		echo get_account($_GET);
	}else if(strpos($uri,'/components') !== false){
		echo get_components($_GET);
	}else if(strpos($uri,'/documents') !== false){
		echo get_documents($_GET);
	}else if(strpos($uri,'/products') !== false){
		echo get_products($_GET);
	}else if(strpos($uri,'/add_to_project') !== false){
		echo add_to_project($_POST);
	}else if(strpos($uri,'/remove_from_project') !== false){
		echo remove_from_project($_POST);
	}else if(strpos($uri,'/upload') !== false){
		echo upload_document($_POST,$_FILES);
	}else if(strpos($uri,'/create_discussion') !== false){
		echo create_discussion($_POST);
	}else if(strpos($uri,'/create_task') !== false){
		echo create_task($_POST);
	}else if(strpos($uri,'/product') !== false){
	  echo get_product($_GET);
	}else if(strpos($uri,'/get_product_review') !== false){
	  echo get_product_review($_GET);
	}else if(strpos($uri,'/add_product_review') !== false){
	  echo add_product_review($_POST);
	}else if(strpos($uri,'/add_like_dislike') !== false){
	  echo add_like_dislike($_POST);
	}else if(strpos($uri,'/edit_product') !== false){
	  echo edit_product($_POST);
	}else if(strpos($uri,'/upp') !== false){
	  echo upload_profile_picture($_POST,$_FILES);
	}else if(strpos($uri,'/ucp') !== false){
	  echo upload_company_picture($_POST,$_FILES);
    }else if(strpos($uri,'/ucl') !== false){
        echo upload_company_logo($_POST,$_FILES);
    }else if(strpos($uri,'/uci') !== false) {
        echo upload_company_image($_POST, $_FILES);
    }else if(strpos($uri,'/ucsi') !== false) {
        echo upload_company_skill_image($_POST, $_FILES);
    }else if(strpos($uri,'/remove_company_images') !== false){
        echo remove_company_images($_POST);
    }else if(strpos($uri,'/remove_company_skills_images') !== false){
        echo remove_company_skills_images($_POST);
	}else if(strpos($uri,'/profiles') !== false){
	  echo get_profile($_GET);
	}else if(strpos($uri,'/profile_reviews') !== false){
	  echo get_profile_review($_GET);
	}else if(strpos($uri,'/add_profile_review') !== false){
	  echo add_profile_review($_POST);
	}else if(strpos($uri,'/edit_profile') !== false){
	  echo edit_profile($_POST);
	}else if(strpos($uri,'/uprpic') !== false){
	  echo upload_edit_profile_picture($_POST,$_FILES);
	}else if(strpos($uri,'/add_product_to_favorite') !== false) {
	  echo add_product_to_favorite($_GET);
	}else if(strpos($uri,'/add_discussion_like_dislike') !== false){
		echo add_discussion_like_dislike($_POST);
	}
});



function addMore($item){
	$item['specificationsData'] = json_decode(httpResponse(dbUrl().$item['specifications'], null, null),true);
	if(count($item['specificationsData']) > 0){
		$item['specificationsData'] = $item['specificationsData'][0];
	}
	if($item['releaseDate'] != null){
		$item['releaseDate'] = date('m/d/Y', strtotime($item['releaseDate']));
	}
	if($item['currentStatus']['startDate'] != null){
		$item['currentStatus']['startDate'] = date('m/d/Y', strtotime($item['currentStatus']['startDate']));
	}

	$item['reviews'] = json_decode(httpResponse(dbUrl().'/product/'.$item['id'].'/product_reviews?productType='.$item['type'].'s&reviewId=0', null, null),true);
	$item['rating'] = [];
	for($k = 0; $k < count($item['reviews']); ++$k){
	  $item['rating'][] = $item['reviews'][$k]['rating'];
	}

	return $item;
}

function create_task($params){
	$error_ = null;
	$result = null;
	if(isset($params['projectId'])) {
		$project = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'], null, null),true);
		if($project != null && isset($project["id"])){
			$last = json_decode(httpResponse(dbUrl().'/tasks?_sort=id&_order=DESC&_limit=1', null, null),true);
			if(count($last) > 0){
				$id = $last[0]['id']+1;
			}else{
				$id = 1;
			}
			$data = json_encode(array(
				"id" => $id,
				"title"=> $params['description'],
				"project" => array(
					"id" => $params['projectId'],
					"title" => $project["title"]
				),
				"assignee" => $params['assignee'],
				"reporter" => "Jack Graber",
				"dueDate" => date('d-m-Y H:i:s', strtotime($params['dueDate'])),
				"priority" => date('d-m-Y H:i:s', strtotime($params['dueDate'])),
				"projectId" => $params['projectId']
			));
			$add_task = json_decode(httpResponse(dbUrl().'/tasks', 'POST', $data),true);
			$result = $add_task;
		}else{
			$error_ = "Project not found";
		}
	}else{
		$error_ = "Project id is wrong";
	}
	return json_encode(array('error' => $error_, 'result' => $result ));
}

function create_discussion($params){
	$error_ = null;
	$result = null;
	if(isset($params['projectId'])) {
		$project = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'], null, null),true);
		if($project != null && isset($project["id"])){
			$last = json_decode(httpResponse(dbUrl().'/discussions?_sort=id&_order=DESC&_limit=1', null, null),true);
			if(count($last) > 0){
				$id = $last[0]['id']+1;
			}else{
				$id = 1;
			}
			$data = json_encode(array(
				"id" => $id,
				"text" => $params['text'],
				"full_name" => "Jack Graber",
				"created_at" => date("d-m-Y H:i:s"),
				"avatar" => "/images/avatar-fpo.jpg",
				"projectId" => $params['projectId']
			));
			$add_discussion = json_decode(httpResponse(dbUrl().'/discussions', 'POST', $data),true);
			$result = $add_discussion;
		}else{
			$error_ = "Project not found";
		}
	}else{
		$error_ = "Project id is wrong";
	}
	return json_encode(array('error' => $error_, 'result' => $result ));
}

function remove_from_project($params){
	if(isset($params['type'])) {
		$product = null;
		$params['type'] = ($params['type'] == 'service' ? 'services' : ($params['type'] == 'component' ? 'components' : null));
		if($params['type'] != null) $product = json_decode(httpResponse(dbUrl().'/'.$params['type'].'/' . $params['id'], null, null), true);
		if($product != null and isset($product['id']) == true) {
			$project = json_decode(httpResponse(dbUrl().'/projects/' . $params['projectId'], null, null), true);
			if($project != null and isset($project['id']) == true) {
				$product['currentStatus']['project']['id'] = 0;
				$product['currentStatus']['project']['title'] = null;
				$product['projectId'] = 0;
				$changed_item = json_decode(httpResponse(dbUrl().'/'.$params['type'].'/' . $params['id'], 'PUT', json_encode($product)), true);
				return json_encode(array('result' => $changed_item));
			}else{
				return json_encode(array('error' => 'Project not found' ));
			}
		}else {
			return json_encode(array('error' => 'Product not found' ));
		}
	}else{
		return json_encode(array('error' => 'Type is wrong' ));
	}
}

function add_product_to_favorite($params){
	if(isset($params['productId']) and isset($params['productType'])) {
		if($params['productType'] == 'service'){
			$product = json_decode(httpResponse(dbUrl().'/services/' . $params['productId'], null, null), true);
		}else{
			$product = json_decode(httpResponse(dbUrl().'/components/' . $params['productId'], null, null), true);
		}
		if($product != null and isset($product['id'])) {
			$favorites = json_decode(httpResponse(dbUrl().'/accounts/1/favorite_products', null, null), true);
			$exist = null;
			for($i = 0; $i < count($favorites); ++$i){
				if($favorites[$i]['productId'] === $product['id'] && $favorites[$i]['productType'] === $params['productType']){
					$exist = $favorites[$i];
					break;
				}
			}
			if($exist != null){
				$changed_item = json_decode(httpResponse(dbUrl().'/favorite_products/' . $exist['id'], 'DELETE', null), true);
				return json_encode(array('favorite' => false));
			}else{
				$last = json_decode(httpResponse(dbUrl() . '/favorite_products?_sort=id&_order=DESC&_limit=1', null, null), true);
				$id = (count($last) > 0 ? $last[0]['id'] + 1 : 1);
				$data = json_encode(array(
					'id' => $id,
					'productId' => $product['id'],
					'accountId' => 1,
					'productType' => $params['productType']
				));
				$add_favorite = json_decode(httpResponse(dbUrl() . '/favorite_products', 'POST', $data), true);
				return json_encode(array('favorite' => true));
			}
		}else{
			return json_encode(array('error' => 'Product does not exist'));
		}
	}else{
		return json_encode(array('error' => 'Data is wrong' ));
	}
}

function add_to_project($params){
	if(isset($params['type'])) {
		$product = null;
		$params['type'] = ($params['type'] == 'service' ? 'services' : ($params['type'] == 'component' ? 'components' : null));
		if($params['type'] != null) $product = json_decode(httpResponse(dbUrl().'/'.$params['type'].'/' . $params['id'], null, null), true);
		if($product != null and isset($product['id']) == true) {
			$project = json_decode(httpResponse(dbUrl().'/projects/' . $params['projectId'], null, null), true);
			if($project != null and isset($project['id']) == true) {
				$product['currentStatus']['project']['id'] = $project['id'];
				$product['currentStatus']['project']['title'] = $project['title'];
				$product['projectId'] = $project['id'];
				$product['from'] = 'marketplace';
				$changed_item = json_decode(httpResponse(dbUrl().'/'.$params['type'].'/' . $params['id'], 'PUT', json_encode($product)), true);
				if($params['type'] == 'services') {
					$changed_item = addMore($changed_item);
					$changed_item['type'] = 'service';
				}else if($params['type'] == 'components'){
					$changed_item = addMore($changed_item);
					$changed_item['type'] = 'component';
				}
				return json_encode(array('result' => $changed_item));
			}else{
				return json_encode(array('error' => 'Project not found' ));
			}
		}else {
			return json_encode(array('error' => 'Product not found' ));
		}
	}else{
		return json_encode(array('error' => 'Type is wrong' ));
	}
}

function searchByName($name,$array,$key){
    $query = $array;
    $name_ = $name;
    if($name != null) {
        if(is_string($name_) && strlen($name_) > 0) {
            $name_ = strtolower($name_);
            $arr = array();
            for($i = 0; $i < count($query); ++$i){
                if (strpos(strtolower($query[$i][$key]), $name_) !== false) array_push($arr, $query[$i]);
            }
            $query = $arr;
        }
    }
    return $query;
}

function isFavoriteProduct($id,$type,$accountId){
	$accountId_ = ($accountId == null ? 1 : $accountId);
	$favorites = json_decode(httpResponse(dbUrl().'/products/'.$id.'/favorite_products?productType='.$type.'&accountId='.$accountId_, null, null),true);
	return (count($favorites) == 0 ? false : true);
}

function getFeaturesIds($companyId,$fill){
	$features = array(
		"services" => [],
		"components" => []
	);
	if($fill) {
		$query = json_decode(httpResponse(dbUrl() . '/companies/' . $companyId . '/company_featured', null, null), true);
		for ($i = 0; $i < count($query); ++$i) {
			if (isset($features[$query[$i]["type"] . 's'])) {
				array_push($features[$query[$i]["type"] . 's'], intval($query[$i]['productId']));
			}
		}
	}
	return $features;
}

function get_products($params){
    $checkFeatures = (isset($params['checkFeatures']) and isset($params['filterData']['companyId']) and $params['checkFeatures'] == true ? true : false);
    $features = getFeaturesIds($params['filterData']['companyId'],$checkFeatures);
    $query = [];
    $components = json_decode(httpResponse(dbUrl().'/components', null, null), true);
    $components = searchByName($params["filterData"]["text"],$components,'title');
    for($i = 0; $i < count($components); ++$i){
        if(in_array(intval($components[$i]['id']),$features['components'])) {
            $components[$i]['inFeatured'] = true;
        }
        $components[$i]['type'] = 'component';
        $components[$i]['favorite'] = isFavoriteProduct($components[$i]['id'], $components[$i]['type'], null);
        $components[$i] = addMore($components[$i]);
        array_push($query,$components[$i]);
    }
    $services = json_decode(httpResponse(dbUrl().'/services', null, null),true);
    $services = searchByName($params["filterData"]["text"],$services,'title');
    for($i = 0; $i < count($services); ++$i){
        if(in_array(intval($services[$i]['id']),$features['services'])) {
            $services[$i]['inFeatured'] = true;
        }
        $services[$i]['type'] = 'service';
        $services[$i]['favorite'] = isFavoriteProduct($services[$i]['id'], $services[$i]['type'], null);
        $services[$i] = addMore($services[$i]);
        array_push($query,$services[$i]);
    }
    $count = count($query);
    usort($query, 'sortByReleaseDateDESC');
    if(isset($params['offset']) == false) $params['offset'] = 0;
    if(isset($params['limit'])) {
        $query = array_slice($query, $params['offset'], $params['limit']);
    }
    $result = array('result' => $query, 'count' => $count);
    return json_encode($result);
}

function edit_service($params){
	$service = json_decode(httpResponse(dbUrl().'/services/'.$params['id'], null, null),true);
	$service['currentStatus']['percentCompleted'] = $params['percentCompleted'];
	$data = json_encode($service);

	$changed_item = json_decode(httpResponse(dbUrl().'/services/'.$params['id'], 'PUT', $data),true);
	$changed_item = addMore($changed_item);
	$changed_item['type'] = 'service';
	return json_encode(array('result' => $changed_item ));
}

function get_components($params){
    if(isset($params['projectId']) == false || $params['projectId'] == null){
        $query = json_decode(httpResponse(dbUrl().'/components', null, null), true);
    }else{
        $query = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'].'/components', null, null),true);
    }
    if(isset($params['ids'])) {
        if(is_array($params['ids']) && count($params['ids']) > 0) {
            $arr = array();
            for($i = 0; $i < count($query); ++$i){
                if (in_array(intval($query[$i]['id']), $params['ids'])) array_push($arr, $query[$i]);
            }
            $query = $arr;
        }else{
            $query = array();
        }
    }
    $query = searchByName($params["filterData"]["text"],$query,"title");

    $checkFeatures = (isset($params['checkFeatures']) and isset($params['filterData']['companyId']) and $params['checkFeatures'] == true ? true : false);
    $features = getFeaturesIds($params['filterData']['companyId'], $checkFeatures);
    for ($i = 0; $i < count($query); ++$i) {
        if (in_array(intval($query[$i]['id']), $features['components'])){
            $query[$i]['inFeatured'] = true;
        }
    }
    $count = count($query);

    if(isset($params['offset']) == false) $params['offset'] = 0;
    if(isset($params['limit'])) {
        $query = array_slice($query, $params['offset'], $params['limit']);
    }
    for($i = 0; $i < count($query); ++$i){
        $query[$i]['type'] = 'component';
        $query[$i]['favorite'] = isFavoriteProduct($query[$i]['id'],$query[$i]['type'],null);
        $query[$i] = addMore($query[$i]);
    }
    $result = array('result' => $query, 'count' => $count);
    return json_encode($result);
}


function get_services($params)
{
    if (isset($params['projectId']) == false || $params['projectId'] == null) {
        $query = json_decode(httpResponse(dbUrl() . '/services', null, null), true);
    } else {
        $query = json_decode(httpResponse(dbUrl() . '/projects/' . $params['projectId'] . '/services', null, null), true);
    }

    if (isset($params['sort'])) {
        if (isset($params['order']) == false) $params['order'] = 'DESC';
        if ($params['sort'] == 'name') {
            if ($params['order'] == 'DESC') {
                usort($query, 'sortByTitleDESC');
            } else {
                usort($query, 'sortByTitleASC');
            }
        } else if ($params['sort'] == 'project') {
            if ($params['order'] == 'DESC') {
                usort($query, 'sortByProjectDESC');
            } else {
                usort($query, 'sortByProjectASC');
            }
        } else if ($params['sort'] === 'status') {
            if ($params['order'] == 'DESC') {
                usort($query, 'sortByStatusDESC');
            } else {
                usort($query, 'sortByStatusASC');
            }
        } else if ($params['sort'] === 'start') {
            if ($params['order'] == 'DESC') {
                usort($query, 'sortByStartDESC');
            } else {
                usort($query, 'sortByStartASC');
            }
        }
    }
    if (isset($params['ids'])) {
        if (is_array($params['ids']) && count($params['ids']) > 0) {
            $arr = array();
            for ($i = 0; $i < count($query); ++$i) {
                if (in_array(intval($query[$i]['id']), $params['ids'])) array_push($arr, $query[$i]);
            }
            $query = $arr;
        } else {
            $query = array();
        }
    }
    $query = searchByName($params["filterData"]["text"], $query,"title");

    $checkFeatures = (isset($params['checkFeatures']) and isset($params["filterData"]['companyId']) and $params['checkFeatures'] == true ? true : false);
    $features = getFeaturesIds($params["filterData"]['companyId'], $checkFeatures);
    for ($i = 0; $i < count($query); ++$i) {
        if (in_array(intval($query[$i]['id']), $features['services'])){
            $query[$i]['inFeatured'] = true;
        }
    }
    $count = count($query);

    $countTypes = array(
        'analytical' => 0,
        'solid' => 0,
        'data' => 0
    );
    if(isset($params["filterData"]['type']) && in_array($params["filterData"]['type'],array('analytical','solid','data'))) {
        $arr = array();
        for($i = 0; $i < count($query); ++$i){
            $countTypes[$query[$i]['serviceType']] += 1;
            if($query[$i]['serviceType'] === $params["filterData"]['type']) array_push($arr, $query[$i]);
        }
        $query = $arr;
    }else{
        for($i = 0; $i < count($query); ++$i) $countTypes[$query[$i]['serviceType']] += 1;
    }
    if(isset($params['offset']) == false) $params['offset'] = 0;
    if(isset($params['limit'])) {
        $query = array_slice($query, $params['offset'], $params['limit']);
    }

    for($i = 0; $i < count($query); ++$i){
        $query[$i]['type'] = 'service';
        $query[$i]['favorite'] = isFavoriteProduct($query[$i]['id'], $query[$i]['type'], null);
        $query[$i] = addMore($query[$i]);
    }
    $result = array('result' => $query, 'count' => $count, 'countTypes' => $countTypes);
    return json_encode($result);
}

function edit_task($params){
	$task = json_decode(httpResponse(dbUrl().'/tasks/'.$params['id'], null, null),true);
	$priority = $task['priority'];
	if($priority == 'Urgent'){
		$priority = 'Today';
	}else if($priority == 'Today'){
		$priority = 'Urgent';
	}else{
		$priority = date('m-d-Y');
	}
	$data = json_encode(
		array(
			'priority' => $priority
		)
	);
	$changed_item = json_decode(httpResponse(dbUrl().'/tasks/'.$params['id'], 'PUT', $data),true);
	return json_encode(array('result' => $changed_item ));
}

function get_tasks($params){
	if(isset($params['projectId']) == false || $params['projectId'] == null){
		$query = json_decode(httpResponse(dbUrl().'/tasks', null, null),true);
	}else{
		$query = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'].'/tasks', null, null),true);
	}
	$count = count($query);
	for($i = 0; $i < $count; ++$i){
		$query[$i]["priority"] = $query[$i]["dueDate"];
	}
	if(isset($params['sort'])) {
		if(isset($params['order']) == false) $params['order'] = 'DESC';
		if ($params['sort'] == 'name') {
			if ($params['order'] == 'DESC') {
				usort($query, 'sortByTitleDESC');
			} else {
				usort($query, 'sortByTitleASC');
			}
		} else if ($params['sort'] == 'project') {
			if ($params['order'] == 'DESC') {
				usort($query, 'sortByProjectTaskDESC');
			} else {
				usort($query, 'sortByProjectTaskASC');
			}
		} else if ($params['sort'] == 'dueDate' || $params['sort'] == 'priority') {
			if ($params['order'] == 'DESC') {
				usort($query, 'sortByDueDateDESC');
			} else {
				usort($query, 'sortByDueDateASC');
			}
		}
	}
	if(isset($params['offset']) == false) $params['offset'] = 0;
	if(isset($params['limit'])) {
		$query = array_slice($query, $params['offset'], $params['limit']);
	}
	for($i = 0; $i < count($query); ++$i){
		$query[$i]['dueDate'] = date('m/d/Y', strtotime($query[$i]['dueDate']));
		$due_date = strtotime($query[$i]['dueDate']);
		$current = strtotime(date("Y-m-d"));
		$dateDiff = $due_date - $current;
		$difference = floor($dateDiff/(60*60*24));
		if($difference == 0) {
			$query[$i]['priority'] = array('today','Today');
		} else if($difference == 1) {
			$query[$i]['priority'] = array('tomorrow','Tomorrow');
		}else if($difference > 1){
			$query[$i]['priority'] = array('date',$query[$i]['dueDate']);
		}else if($difference < 0){
			$name_d = ($difference == -1 ? 'day' : 'days');
			$query[$i]['priority'] = array('after','Due '.(-1*$difference).' '.$name_d.' ago ('.$query[$i]['dueDate'].')');
		}
	}
	$result = array('result' => $query, 'count' => $count);
	return json_encode($result);
}

function get_discussions($params){
	if(isset($params['projectId']) == false || $params['projectId'] == null){
		$query = json_decode(httpResponse(dbUrl().'/discussions', null, null),true);
	}else{
		$query = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'].'/discussions', null, null),true);
	}
	if(isset($params['sort'])) {
		if (isset($params['order']) == false) $params['order'] = 'DESC';
		if ($params['sort'] == 'created_at') {
			if ($params['order'] == 'DESC') {
				usort($query, 'sortByCreatedAtDESC');
			} else {
				usort($query, 'sortByCreatedAtASC');
			}
		} else {
			usort($query, 'sortByCreatedAtDESC');
		}
	}
	$count = count($query);
	$query = array_slice($query, $params['offset'], $params['limit']);
	$result = array('result' => $query, 'count' => $count);
	return json_encode($result);
}

function get_company($params){
	$result = array('success' => false, 'result' => null);
	if(isset($params['id']) == true){
		$query = json_decode(httpResponse(dbUrl().'/companies/'.$params['id'], null, null),true);
		$result['result'] = $query;
		$accountId_ = 1;
		$account_follow = json_decode(httpResponse(dbUrl().'/accounts/'.$accountId_.'/company_follows?companyId='.$params['id'], null, null), true);
		$result['result']['follow'] = (count($account_follow) > 0 ? true : false);
		$account_favorites = json_decode(httpResponse(dbUrl().'/accounts/'.$accountId_.'/favorite_products', null, null),true);
		$result['result']['favoritesCount'] = count($account_favorites);

        $owner = json_decode(httpResponse(dbUrl().'/accounts/'.$query["accountId"], null, null),true);
        $result['result']['isOwner'] = ($accountId_ == $query["accountId"] ? true : false);
        $result['result']['owner'] = array(
            'id' => $owner["id"],
            'displayName' => ($owner["displayName"] ? $owner["displayName"] : $owner["firstName"].' '.$owner["lastName"])
         );

        $result['result']['reviews'] = json_decode(httpResponse(dbUrl().'/company/'.$result['result']['id'].'/company_reviews?reviewId=0', null, null),true);
		$result['result']['rating'] = [];
		for($k = 0; $k < count($result['result']['reviews']); ++$k){
		  $result['result']['rating'][] = $result['result']['reviews'][$k]['rating'];
		}
	}
	return json_encode($result);
}

function get_company_review($params){
	if(isset($params['companyId'])){
		if(isset($params['sort'])){
			switch ($params['sort']) {
				case 'date':
					$query = json_decode(httpResponse(dbUrl() . '/companies/' . $params['companyId'] . '/company_reviews?reviewId=0', null, null), true);
					usort($query, 'sortByReviewDateDESC');
					break;
				case 'rating':
					$query = json_decode(httpResponse(dbUrl() . '/companies/' . $params['companyId'] . '/company_reviews?reviewId=0', null, null), true);
					if ($params['order'] == 'DESC') {
						usort($query, 'sortByReviewRatingDESC');
					} else {
						usort($query, 'sortByReviewRatingASC');
					}
					break;
				case 'verified':
					$query = json_decode(httpResponse(dbUrl() . '/companies/' . $params['companyId'] . '/company_reviews?status=true&reviewId=0', null, null), true);
					break;
				case 'stars':
					$query = json_decode(httpResponse(dbUrl() . '/companies/' . $params['companyId'] . '/company_reviews?rating=' . $params['order'] . '&reviewId=0', null, null), true);
					break;
				case 'helpful':
					$query = json_decode(httpResponse(dbUrl() . '/companies/' . $params['companyId'] . '/company_reviews?reviewId=0&_sort=like&_order=DESC', null, null), true);
					break;
				case 'leasthelpful':
					$query = json_decode(httpResponse(dbUrl() . '/companies/' . $params['productId'] . '/company_reviews?reviewId=0&_sort=like&_order=ASC', null, null), true);
					break;
			}
		}
	}

	if(isset($params['limit'])) {
		$query = array_slice($query, 0, $params['limit']);
	}
	for($i = 0; $i < count($query); ++$i){
		if($query[$i]['reply']){
			$query[$i]['replyReviews'] = json_decode(httpResponse(dbUrl() . '/review/' . $query[$i]['id'] . '/company_reviews?_sort=id&_order=ASC', null, null), true);
		}else{
			$query[$i]['replyReviews'] = [];
		}
	}
	$result = array('result' => $query, 'param' => $params);
	return json_encode($result);
}

function add_company_review($params){
  $last = json_decode(httpResponse(dbUrl().'/company_reviews?_sort=id&_order=DESC&_limit=1', null, null),true);
  if(count($last) > 0){
		$id = $last[0]['id']+1;
  }else{
		$id = 1;
  }

  if($params['reviewId'] != 0){
	$review = json_decode(httpResponse(dbUrl().'/company_reviews/'.$params['reviewId'], null, null),true);
	$review['reply'] = true;
	$data = json_encode($review);
	json_decode(httpResponse(dbUrl().'/company_reviews/'.$params['reviewId'], 'PUT', $data),true);
  }

  $data = json_encode(array(
	  "id" => $id,
	  "companyId" => $params['companyId'],
	  "reply" => false,
	  "reviewId" => $params['reviewId'],
	  "name" => $params['name'],
	  "status" => $params['status'],
	  "date" => date("m-d-Y"),
	  "rating" => $params['rating'],
	  "userRatingReview" => array("DMC Member" => "none"),
	  "like" => 0,
	  "dislike" => 0,
	  "comment" => $params['comment']
  ));
  $review = json_decode(httpResponse(dbUrl().'/company_reviews', 'POST', $data),true);
  return json_encode($review);
}



function get_account($params){
	$result = array('success' => false, 'result' => null);
	if(isset($params['id']) == true){
		$query = json_decode(httpResponse(dbUrl().'/accounts/'.$params['id'], null, null),true);
		$result['result'] = $query;
	}
	return json_encode($result);
}

function get_projects($params){
	if(isset($params['projectId']) == false || $params['projectId'] == null){
		$query = json_decode(httpResponse(dbUrl().'/projects', null, null),true);
		if(isset($params['offset']) == false) $params['offset'] = 0;
		if(isset($params['limit'])) {
			$query = array_slice($query, $params['offset'], $params['limit']);
		}
	}else{
		$query = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'], null, null),true);
	}
	$default_url = dbUrl();
	for($i = 0; $i < count($query); ++$i){
		$tl = $default_url.$query[$i]['tasks']['link'];
		$sl = $default_url.$query[$i]['services']['link'];
		$dl = $default_url.$query[$i]['discussions']['link'];
		$query[$i]['tasks']['totalItems'] = count(json_decode(httpResponse($tl, null, null), true));
		$query[$i]['tasks']['data'] = json_decode(httpResponse($tl, null, null), true);
		$query[$i]['services']['totalItems'] = count(json_decode(httpResponse($sl, null, null), true));
		$query[$i]['services']['data'] = json_decode(httpResponse($sl, null, null), true);
		$query[$i]['discussions']['totalItems'] = count(json_decode(httpResponse($dl, null, null), true));
		$query[$i]['discussions']['data'] = json_decode(httpResponse($dl, null, null), true);
	}
	$result = array('result' => $query);
	return json_encode($result);
}

function get_documents($params){
	if(isset($params['projectId']) || $params['projectId'] != null){
		$query = json_decode(httpResponse(dbUrl().'/projects/'.$params['projectId'].'/documents', null, null),true);
		if(isset($params['offset']) == false) $params['offset'] = 0;
		if(isset($params['limit'])) {
			$query = array_slice($query, $params['offset'], $params['limit']);
		}
	}else{
		$query = array();
	}
	$count = count($query);
	$result = array('result' => $query, 'count' => $count);
	return json_encode($result);
}

function upload_company_logo($params,$file){
    if(isset($params['id'])) {
        $company = json_decode(httpResponse(dbUrl().'/companies/' . $params['id'], null, null), true);
        if($company != null and isset($company['id']) == true) {
            $id = $params['id'];
            $mainDir = dirname(__DIR__);
            $fileFolder = '\\uploads\\company\\logo\\' . $id;
            if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
            if (mkdir($mainDir . $fileFolder, 0755)) {
                $name_file = basename($file['file']['name']);
                $type = substr($name_file, strripos($name_file, '.'));
                $name_file = date('YmdHisu') . $type;
                $uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
                if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
                    $otherName = '/uploads/company/logo/' . $id .'/'.$name_file;
                    $file['name'] = $otherName;
                    $company['logoImage'] = $otherName;
                    $changed_item = json_decode(httpResponse(dbUrl().'/companies/'.$params['id'], 'PUT', json_encode($company)),true);
                    return json_encode(array('result' => 'file saved', 'file' => $file));
                } else {
                    return json_encode(array('error' => 'Possible attacks via file download','$file' => $file));
                }
            } else {
                return json_encode(array('error' => 'Unable create directory '));
            }
        }else{
            return json_encode(array('error' => 'Company does not exist' ));
        }
    }else{
        return json_encode(array('error' => 'Data is wrong' ));
    }
}

function remove_company_skills_images($params){
    if(isset($params['ids'])){
        $mainDir = dirname(__DIR__);
        for($i = 0; $i < count($params['ids']); ++$i){
            $fileFolder = '\\uploads\\company\\skill-image\\' . $params['ids'][$i];
            if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
            $delete_image = json_decode(httpResponse(dbUrl().'/company_skill_images/'.$params['ids'][$i], 'DELETE', null),true);
        }
    }
    return json_encode(array('result' => 'success'));
}

function remove_company_images($params){
    if(isset($params['ids'])){
        $mainDir = dirname(__DIR__);
        for($i = 0; $i < count($params['ids']); ++$i){
            $fileFolder = '\\uploads\\company\\image\\' . $params['ids'][$i];
            if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
            $delete_image = json_decode(httpResponse(dbUrl().'/company_images/'.$params['ids'][$i], 'DELETE', null),true);
        }
    }
    return json_encode(array('result' => 'success'));
}

function upload_company_skill_image($params,$file){
    if(isset($params['id'])) {
        $company = json_decode(httpResponse(dbUrl().'/companies/' . $params['id'], null, null), true);
        if($company != null and isset($company['id']) == true) {
            $last = json_decode(httpResponse(dbUrl() . '/company_skill_images?_sort=id&_order=DESC&_limit=1', null, null), true);
            $last_id = (count($last) > 0 ? $last[0]['id'] + 1 : 1);

            $id = $last_id;
            $mainDir = dirname(__DIR__);
            $fileFolder = '\\uploads\\company\\skill-image\\' . $id;
            if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
            if (mkdir($mainDir . $fileFolder, 0755)) {
                $name_file = basename($file['file']['name']);
                $type = substr($name_file, strripos($name_file, '.'));
                $name_file = date('YmdHisu') . $type;
                $uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
                if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
                    $otherName = '/uploads/company/skill-image/' . $id .'/'.$name_file;
                    $file['name'] = $otherName;
                    $image = array(
                        'id' => $last_id,
                        'companyId' => $params['id'],
                        'url' => $otherName,
                        'title' => $params['title']
                    );
                    $added_image = json_decode(httpResponse(dbUrl().'/company_skill_images', 'POST', json_encode($image)),true);
                    return json_encode(array('result' => $added_image));
                } else {
                    return json_encode(array('error' => 'Possible attacks via file download','$file' => $file));
                }
            } else {
                return json_encode(array('error' => 'Unable create directory '));
            }
        }else{
            return json_encode(array('error' => 'Company does not exist' ));
        }
    }else{
        return json_encode(array('error' => 'Data is wrong' ));
    }
}

function upload_company_image($params,$file){
    if(isset($params['id'])) {
        $company = json_decode(httpResponse(dbUrl().'/companies/' . $params['id'], null, null), true);
        if($company != null and isset($company['id']) == true) {
            $last = json_decode(httpResponse(dbUrl() . '/company_images?_sort=id&_order=DESC&_limit=1', null, null), true);
            $last_id = (count($last) > 0 ? $last[0]['id'] + 1 : 1);

            $id = $last_id;
            $mainDir = dirname(__DIR__);
            $fileFolder = '\\uploads\\company\\image\\' . $id;
            if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
            if (mkdir($mainDir . $fileFolder, 0755)) {
                $name_file = basename($file['file']['name']);
                $type = substr($name_file, strripos($name_file, '.'));
                $name_file = date('YmdHisu') . $type;
                $uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
                if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
                    $otherName = '/uploads/company/image/' . $id .'/'.$name_file;
                    $file['name'] = $otherName;
                    $image = array(
                        'id' => $last_id,
                        'companyId' => $params['id'],
                        'url' => $otherName,
                        'title' => $params['title']
                    );
                    $added_image = json_decode(httpResponse(dbUrl().'/company_images', 'POST', json_encode($image)),true);
                    return json_encode(array('result' => $added_image));
                } else {
                    return json_encode(array('error' => 'Possible attacks via file download','$file' => $file));
                }
            } else {
                return json_encode(array('error' => 'Unable create directory '));
            }
        }else{
            return json_encode(array('error' => 'Company does not exist' ));
        }
    }else{
        return json_encode(array('error' => 'Data is wrong' ));
    }
}

function upload_company_picture($params,$file){
	if(isset($params['id'])) {
		$company = json_decode(httpResponse(dbUrl().'/companies/' . $params['id'], null, null), true);
		if($company != null and isset($company['id']) == true) {
			$id = $params['id'];
			$mainDir = dirname(__DIR__);
			$fileFolder = '\\uploads\\company\\picture\\' . $id;
			if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
			if (mkdir($mainDir . $fileFolder, 0755)) {
				$name_file = basename($file['file']['name']);
				$type = substr($name_file, strripos($name_file, '.'));
				$name_file = date('YmdHisu') . $type;
				$uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
				if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
					$otherName = '/uploads/company/picture/' . $id .'/'.$name_file;
					$file['name'] = $otherName;
					$company['featureImage']['thumbnail'] = $otherName;
					$company['featureImage']['large'] = $otherName;
					$changed_item = json_decode(httpResponse(dbUrl().'/companies/'.$params['id'], 'PUT', json_encode($company)),true);
					return json_encode(array('result' => 'file saved', 'file' => $file));
				} else {
					return json_encode(array('error' => 'Possible attacks via file download','$file' => $file));
				}
			} else {
				return json_encode(array('error' => 'Unable create directory '));
			}
		}else{
			return json_encode(array('error' => 'Company does not exist' ));
		}
	}else{
		return json_encode(array('error' => 'Data is wrong' ));
	}
}

function upload_profile_picture($params,$file){
	if(isset($params['id'])) {
		$account = json_decode(httpResponse(dbUrl().'/accounts/' . $params['id'], null, null), true);
		if($account != null and isset($account['id']) == true) {
			$id = $params['id'];
			$mainDir = dirname(__DIR__);
			$fileFolder = '\\uploads\\account-profile\\' . $id;
			if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
			if (mkdir($mainDir . $fileFolder, 0755)) {
				$name_file = basename($file['file']['name']);
				$type = substr($name_file, strripos($name_file, '.'));
				$name_file = date('YmdHisu') . $type;
				$uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
				if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
					$otherName = '/uploads/account-profile/' . $id .'/'.$name_file;
					$file['name'] = $otherName;
					$account['featureImage']['thumbnail'] = $otherName;
					$account['featureImage']['large'] = $otherName;
					$changed_item = json_decode(httpResponse(dbUrl().'/accounts/'.$params['id'], 'PUT', json_encode($account)),true);
					return json_encode(array('result' => 'file saved', 'file' => $file));
				} else {
					return json_encode(array('error' => 'Possible attacks via file download'));
				}
			} else {
				return json_encode(array('error' => 'Unable create directory '));
			}
		}else{
			return json_encode(array('error' => 'Account does not exist' ));
		}
	}else{
		return json_encode(array('error' => 'Account id does not exist'));
	}
}

function upload_document($params,$file){
	$last = json_decode(httpResponse(dbUrl().'/documents?_sort=id&_order=DESC&_limit=1', null, null),true);
	if(count($last) > 0){
		$id = $last[0]['id']+1;
	}else{
		$id = 1;
	}
	$mainDir = dirname(__DIR__);
	$fileFolder =  '\\uploads\\'.$id;
	if(is_dir($mainDir.$fileFolder)) delete_directory($mainDir.$fileFolder);
	if(mkdir($mainDir.$fileFolder, 0755)){
		$name_file = basename($file['file']['name']);
		$uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
		if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
			$data = json_encode(array(
				'id' => $id,
				'title' => $params['title'] ? $params['title'] : $file['file']['title'],
				'projectId' => $params['projectId'],
				'file' => '/uploads/' . $id . '/' . $name_file
			));
			$add_document = json_decode(httpResponse(dbUrl().'/documents', 'POST', $data),true);
			return json_encode(array('result' => $add_document ,'file' => $file));
		} else {
			return json_encode(array('error' => 'Possible attacks via file download' ));
		}
	}else{
		return json_encode(array('error' => 'Unable create directory '));
	}
}

function delete_directory($dirName) {
	if (is_dir($dirName)) $dir_handle = opendir($dirName);
	if (!$dir_handle) return false;
	while($file = readdir($dir_handle)) {
		if ($file != '.' && $file != '..') {
			if (!is_dir($dirName.'/'.$file)) {
				unlink($dirName . '/' . $file);
			}else {
				delete_directory($dirName . '/' . $file);
			}
		}
	}
	closedir($dir_handle);
	rmdir($dirName);
	return true;
}

function get_product($params){
  $error = null;
  if(isset($params['productId']) && isset($params['typeProduct'])){
	$query = json_decode(httpResponse(dbUrl().'/'.$params['typeProduct'].'/'.$params['productId'], null, null),true);
	if(isset($query['id'])) {
		if ($params['typeProduct'] == 'services') {
			$query['type'] = 'service';
		} else if ($params['type'] == 'components') {
			$query['type'] = 'component';
		}
		$query['favorite'] = isFavoriteProduct($query['id'], $query['type'], null);
		$query = addMore($query);
	}else{
		$error = 'Product does not exist';
	}
  }else{
	  $error = 'Data is wrong';
  }

  $result = array('error' => $error, 'result' => $query);
  return json_encode($result);
}

function get_product_review($params){
	if(isset($params['productId']) && isset($params['typeProduct'])){
		if(isset($params['sort'])){
			switch ($params['sort']) {
				case 'date':
					$query = json_decode(httpResponse(dbUrl() . '/product/' . $params['productId'] . '/product_reviews?productType=' . $params['typeProduct'] . '&reviewId=0', null, null), true);
					usort($query, 'sortByReviewDateDESC');
					break;
				case 'rating':
					$query = json_decode(httpResponse(dbUrl() . '/product/' . $params['productId'] . '/product_reviews?productType=' . $params['typeProduct'] . '&reviewId=0', null, null), true);
					if ($params['order'] == 'DESC') {
						usort($query, 'sortByReviewRatingDESC');
					} else {
						usort($query, 'sortByReviewRatingASC');
					}
					break;
				case 'verified':
					$query = json_decode(httpResponse(dbUrl() . '/product/' . $params['productId'] . '/product_reviews?productType=' . $params['typeProduct'] . '&status=true&reviewId=0', null, null), true);
					break;
				case 'stars':
					$query = json_decode(httpResponse(dbUrl() . '/product/' . $params['productId'] . '/product_reviews?productType=' . $params['typeProduct'] . '&rating=' . $params['order'] . '&reviewId=0', null, null), true);
					break;
				case 'helpful':
					$query = json_decode(httpResponse(dbUrl() . '/product/' . $params['productId'] . '/product_reviews?productType=' . $params['typeProduct'] . '&reviewId=0&_sort=like&_order=DESC', null, null), true);
					break;
				case 'leasthelpful':
					$query = json_decode(httpResponse(dbUrl() . '/product/' . $params['productId'] . '/product_reviews?productType=' . $params['typeProduct'] . '&reviewId=0&_sort=like&_order=ASC', null, null), true);
					break;
			}
		}
	}

	if(isset($params['limit'])) {
		$query = array_slice($query, 0, $params['limit']);
	}
	for($i = 0; $i < count($query); ++$i){
		if($query[$i]['reply']){
			$query[$i]['replyReviews'] = json_decode(httpResponse(dbUrl() . '/review/' . $query[$i]['id'] . '/product_reviews?_sort=id&_order=ASC', null, null), true);
		}else{
			$query[$i]['replyReviews'] = [];
		}
	}
	$result = array('result' => $query);
	return json_encode($result);
}

function add_product_review($params){
  $last = json_decode(httpResponse(dbUrl().'/product_reviews?_sort=id&_order=DESC&_limit=1', null, null),true);
  if(count($last) > 0){
	$id = $last[0]['id']+1;
  }else{
	$id = 1;
  }

  if($params['reviewId'] != 0){
	$review = json_decode(httpResponse(dbUrl().'/product_reviews/'.$params['reviewId'], null, null),true);
	$review['reply'] = true;
	$data = json_encode($review);
	json_decode(httpResponse(dbUrl().'/product_reviews/'.$params['reviewId'], 'PUT', $data),true);
  }

  $data = json_encode(array(
	  "id" => $id,
	  "productId" => $params['productId'],
	  "productType" => $params['productType'],
	  "reply" => false,
	  "reviewId" => $params['reviewId'],
	  "name" => $params['name'],
	  "status" => $params['status'],
	  "date" => date("m-d-Y"),
	  "rating" => $params['rating'],
	  "userRatingReview" => array("DMC Member" => "none"),
	  "like" => 0,
	  "dislike" => 0,
	  "comment" => $params['comment']
  ));
  $review = json_decode(httpResponse(dbUrl().'/product_reviews', 'POST', $data),true);
  return json_encode($review);
}

function add_like_dislike($params){
	$review = json_decode(httpResponse(dbUrl().'/'.$params['typeReview'].'/'.$params['reviewId'], null, null),true);
	$review['like'] = $params['like'];
	$review['dislike'] = $params['dislike'];
	$review['userRatingReview'][$params['userLogin']] = $params['ratingReview'];
	$data = json_encode($review);
	json_decode(httpResponse(dbUrl().'/'.$params['typeReview'].'/'.$params['reviewId'], 'PUT', $data),true);
	return json_encode($data);
}

function edit_product($params){
  $service = json_decode(httpResponse(dbUrl().'/'.$params['typeProduct'].'s/'.$params['productId'], null, null),true);
  $service['title'] = $params['title'];

  if(isset($params['tags'])){
	$service['tags'] = $params['tags'];
  }else{
	$service['tags'] = [];
  }
  $service['description'] = $params['description'];

  $data = json_encode($service);


  $specification = json_decode(httpResponse(dbUrl() . '/specifications/' . $params['specificationId'], null, null),true);
  if(isset($params['specification'])){
	$specification['special'] = $params['specification'];
  }else{
  	$specification['special'] = [];
  }
  $specification['input'] = $params['inputs'];
  $specification['output'] = $params['outputs'];
  $data_sp = json_encode($specification);
  $changed_item = json_decode(httpResponse(dbUrl() . '/specifications/' . $params['specificationId'], 'PUT', $data_sp),true);

  $changed_item = json_decode(httpResponse(dbUrl().'/'.$params['typeProduct'].'s/'.$params['productId'], 'PUT', $data),true);
  return json_encode(array('result' => $changed_item ));
}

function get_profile($params){
  if(isset($params['profileId'])){

    $query = json_decode(httpResponse(dbUrl().'/profiles/'.$params['profileId'], null, null),true);

    $query['reviews'] = json_decode(httpResponse(dbUrl().'/profiles/'.$query['id'].'/profile_reviews?reviewId=0', null, null),true);
    $query['rating'] = [];
    for($k = 0; $k < count($query['reviews']); ++$k){
      $query['rating'][] = $query['reviews'][$k]['rating'];
    }
  }else{
	return false;
  }

  $result = array('result' => $query, "aaa" => "a");
  return json_encode($result);
}

function get_profile_review($params){
	if(isset($params['profileId'])){
		if(isset($params['sort'])){
			switch ($params['sort']) {
				case 'date':
					$query = json_decode(httpResponse(dbUrl() . '/profiles/' . $params['profileId'] . '/profile_reviews?reviewId=0', null, null), true);
					usort($query, 'sortByReviewDateDESC');
					break;
				case 'rating':
					$query = json_decode(httpResponse(dbUrl() . '/profiles/' . $params['profileId'] . '/profile_reviews?reviewId=0', null, null), true);
					if ($params['order'] == 'DESC') {
						usort($query, 'sortByReviewRatingDESC');
					} else {
						usort($query, 'sortByReviewRatingASC');
					}
					break;
				case 'verified':
					$query = json_decode(httpResponse(dbUrl() . '/profiles/' . $params['profileId'] . '/profile_reviews?status=true&reviewId=0', null, null), true);
					break;
				case 'stars':
					$query = json_decode(httpResponse(dbUrl() . '/profiles/' . $params['profileId'] . '/profile_reviews?rating=' . $params['order'] . '&reviewId=0', null, null), true);
					break;
				case 'helpful':
					$query = json_decode(httpResponse(dbUrl() . '/profiles/' . $params['profileId'] . '/profile_reviews?reviewId=0&_sort=like&_order=DESC', null, null), true);
					break;
			}
		}
	}

	if(isset($params['limit'])) {
		$query = array_slice($query, 0, $params['limit']);
	}
	for($i = 0; $i < count($query); ++$i){
		if($query[$i]['reply']){
			$query[$i]['replyReviews'] = json_decode(httpResponse(dbUrl() . '/review/' . $query[$i]['id'] . '/profile_reviews?_sort=id&_order=ASC', null, null), true);
		}else{
			$query[$i]['replyReviews'] = [];
		}
	}
	$result = array('result' => $query);
	return json_encode($result);
}

function add_profile_review($params){
  $last = json_decode(httpResponse(dbUrl().'/profile_reviews?_sort=id&_order=DESC&_limit=1', null, null),true);
  if(count($last) > 0){
	$id = $last[0]['id']+1;
  }else{
	$id = 1;
  }

  if($params['reviewId'] != 0){
	$review = json_decode(httpResponse(dbUrl().'/profile_reviews/'.$params['reviewId'], null, null),true);
	$review['reply'] = true;
	$data = json_encode($review);
	json_decode(httpResponse(dbUrl().'/profile_reviews/'.$params['reviewId'], 'PUT', $data),true);
  }

  $data = json_encode(array(
	  "id" => $id,
	  "profileId" => $params['profileId'],
	  "reply" => false,
	  "reviewId" => $params['reviewId'],
	  "name" => $params['name'],
	  "status" => $params['status'],
	  "date" => date("m-d-Y"),
	  "rating" => $params['rating'],
	  "userRatingReview" => array("DMC Member" => "none"),
	  "like" => 0,
	  "dislike" => 0,
	  "comment" => $params['comment']
  ));
  $review = json_decode(httpResponse(dbUrl().'/profile_reviews', 'POST', $data),true);
  return json_encode($review);
}

function edit_profile($params){
  $profile = json_decode(httpResponse(dbUrl().'/profiles/'.$params['profileId'], null, null),true);

  if(isset($params['skills'])){
	$profile['skills'] = $params['skills'];
  }else{
	$profile['skills'] = [];
  }
  $profile['displayName'] = $params['displayName'];
  $profile['jobTitle'] = $params['jobTitle'];
  $profile['location'] = $params['location'];
  $profile['description'] = $params['description'];

  $data = json_encode($profile);

  $changed_item = json_decode(httpResponse(dbUrl().'/profiles/'.$params['profileId'], 'PUT', $data),true);
  return json_encode(array('result' => $changed_item ));
}



function upload_edit_profile_picture($params,$file){
  if(isset($params['id'])) {
	$profile = json_decode(httpResponse(dbUrl().'/profiles/' . $params['id'], null, null), true);
	if($profile != null and isset($profile['id']) == true) {
	  $id = $params['id'];
	  $mainDir = dirname(__DIR__);
	  $fileFolder = '\\uploads\\profile\\' . $id;
	  if (is_dir($mainDir . $fileFolder)) delete_directory($mainDir . $fileFolder);
	  if (mkdir($mainDir . $fileFolder, 0755)) {
		$name_file = basename($file['file']['name']);
		$type = substr($name_file, strripos($name_file, '.'));
		$name_file = date('YmdHisu') . $type;
		$uploadFile = $mainDir . $fileFolder . '\\' . $name_file;
		if (move_uploaded_file($file['file']['tmp_name'], $uploadFile)) {
		  $otherName = '/uploads/profile/' . $id .'/'.$name_file;
		  $file['name'] = $otherName;
		  $profile['image'] = $otherName;
		  $changed_item = json_decode(httpResponse(dbUrl().'/profiles/'.$params['id'], 'PUT', json_encode($profile)),true);
		  return json_encode(array('result' => 'file saved', 'file' => $file));
		} else {
		  return json_encode(array('error' => 'Possible attacks via file download'));
		}
	  } else {
		return json_encode(array('error' => 'Unable create directory '));
	  }
	}else{
	  return json_encode(array('error' => 'Profile does not exist' ));
	}
  }else{
	return json_encode(array('error' => 'Profile id does not exist'));
  }
}

?>

