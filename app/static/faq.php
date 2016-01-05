<?php

function getSubcategoryId($a){
    return $a["faq_subcategoryId"];
}
function getCategoryId($a){
    return $a["faq_categoryId"];
}
function getId($a){
    return $a["id"];
}
function addIdToVal($a){
    return "id=".$a;
}

function searchByText($text,$array){
    $query = $array;
    if(is_string($text) && strlen($text) > 0) {
        $text_ = strtolower($text);
        $arr = array();
        for($i = 0; $i < count($query); ++$i){
            if (strpos(strtolower($query[$i]['title']), $text_) !== false or strpos(strtolower($query[$i]['text']), $text_) !== false) array_push($arr, $query[$i]);
        }
        $query = $arr;
    }
    return $query;
}

function get_faq_categories($params){
    $categoryId = null;
    if(isset($params["text"])) {
        $articles = json_decode(httpResponse(dbUrl() . '/faq_articles', null, null), true);
        $articles = searchByText($params["text"],$articles);
        if(count($articles) > 0) {
            $subcategoryIds = array_unique(array_map("getSubcategoryId", $articles));
            $categoryIds = array_unique(array_map("getCategoryId", json_decode(httpResponse(dbUrl() . '/faq_subcategories?' . join("&", array_map("addIdToVal", $subcategoryIds)), null, null), true)));
            if (isset($params["categoryId"]) and in_array($params["categoryId"], $categoryIds)) $categoryId = $params["categoryId"];
            if (isset($params["limit"]) and intval($params["limit"]) > 0) {
                $faqCategories = json_decode(httpResponse(dbUrl() . '/faq_categories?' . join("&", array_map("addIdToVal", $categoryIds)) . '&_sort=id&_order=DESC&_limit=' . $params["limit"], null, null), true);
                $totalCategories = count(json_decode(httpResponse(dbUrl() . '/faq_categories?' . join("&", array_map("addIdToVal", $categoryIds)), null, null), true));
            } else {
                $faqCategories = json_decode(httpResponse(dbUrl() . '/faq_categories?' . join("&", array_map("addIdToVal", $categoryIds)) . '&_sort=id&_order=DESC', null, null), true);
                $totalCategories = count($faqCategories);
            }
            if ($categoryId == null and count($faqCategories > 0)) $categoryId = $faqCategories[0]["id"];
        }
    }else{
        if (isset($params["limit"]) and intval($params["limit"]) > 0) {
            $faqCategories = json_decode(httpResponse(dbUrl() . '/faq_categories?_sort=id&_order=DESC&_limit=' . $params["limit"], null, null), true);
            $totalCategories = count(json_decode(httpResponse(dbUrl() . '/faq_categories', null, null), true));
        } else {
            $faqCategories = json_decode(httpResponse(dbUrl() . '/faq_categories?_sort=id&_order=DESC', null, null), true);
            $totalCategories = count($faqCategories);
        }
        if($params["categoryId"] == 'all' and count($faqCategories > 0)) $categoryId = $faqCategories[0]["id"];
    }
    return json_encode(array('result' => $faqCategories, 'totalCategories' => $totalCategories, 'categoryId' => $categoryId));
}

function get_faq_category($params){
    if(isset($params["categoryId"]) && intval($params["categoryId"]) > 0){
        $categoryId = null;
        $subcategoryIds = null;
        $articleIds = null;
        if(isset($params["text"])) {
            $articles = json_decode(httpResponse(dbUrl() . '/faq_articles', null, null), true);
            $articles = searchByText($params["text"],$articles);
            if(count($articles) > 0) {
                $articleIds = array_map("getId", $articles);
                $subcategoryIds = array_unique(array_map("getSubcategoryId", $articles));
                $categoryIds = array_unique(array_map("getCategoryId", json_decode(httpResponse(dbUrl() . '/faq_subcategories?' . join("&", array_map("addIdToVal", $subcategoryIds)), null, null), true)));
                if (in_array($params["categoryId"], $categoryIds)) {
                    $categoryId = $params["categoryId"];
                } else {
                    if (count($categoryIds) > 0) $categoryId = $categoryIds[0];
                }
            }
        }
        $category = json_decode(httpResponse(dbUrl() . '/faq_categories/'.$categoryId, null, null), true);
        if($category != null and isset($category["id"])){
            if($subcategoryIds != null) {
                $category["subcategories"] = json_decode(httpResponse(dbUrl() . '/faq_subcategories?'.join("&",array_map("addIdToVal",$subcategoryIds)).'&faq_categoryId='.$categoryId.'&_sort=id&_order=DESC', null, null), true);
            }else{
                $category["subcategories"] = json_decode(httpResponse(dbUrl() . '/faq_categories/' . $categoryId . '/faq_subcategories?_sort=id&_order=DESC', null, null), true);
            }
            $countSubcategories = count($category["subcategories"]);
            if ($countSubcategories > 0) {
                for($i = 0; $i < $countSubcategories; ++$i){
                    $category["subcategories"][$i]["items"] = array();
                    if($articleIds != null) {
                        $category["subcategories"][$i]["items"] = json_decode(httpResponse(dbUrl() . '/faq_articles?'.join("&",array_map("addIdToVal",$articleIds)).'&faq_subcategoryId='.$category["subcategories"][$i]["id"].'&_sort=id&_order=DESC', null, null), true);
                    }else{
                        $category["subcategories"][$i]["items"] = json_decode(httpResponse(dbUrl() . '/faq_subcategories/' . $category["subcategories"][$i]["id"] . '/faq_articles?_sort=id&_order=DESC', null, null), true);
                    }
                    $countItems = count($category["subcategories"][$i]["items"]);
                    if($countItems > 0) {
                        for ($j = 0; $j < $countItems; ++$j) {
                            unset($category["subcategories"][$i]["items"][$j]["text"]);
                        }
                    }
                }
            }
            return json_encode(array('result' => $category, 'categoryId' => $categoryId));
        }else{
            return json_encode(array('error' => "FAQ Category does not exist"));
        }
    }else{
        return json_encode(array('error' => "Wrong data"));
    }
}

function get_faq_article($params){
    if(isset($params["articleId"]) and intval($params["articleId"]) > 0){
        $article = json_decode(httpResponse(dbUrl() . '/faq_articles/'.$params["articleId"], null, null), true);
        if($article != null and isset($article["id"])){
            $subcategory = json_decode(httpResponse(dbUrl() . '/faq_subcategories/'.$article["faq_subcategoryId"], null, null), true);
            if($subcategory != null and isset($subcategory["id"])) {
                $category = json_decode(httpResponse(dbUrl() . '/faq_categories/'.$subcategory["faq_categoryId"], null, null), true);
                if($category != null and isset($category["id"])) {
                    $relatedArticles = json_decode(httpResponse(dbUrl() . '/faq_subcategories/'.$article["faq_subcategoryId"].'/faq_articles', null, null), true);
                    for($i = 0; $i < count($relatedArticles); ++$i) {
                        $relatedArticles[$i]["categoryId"] = $subcategory["faq_categoryId"];
                        unset($relatedArticles[$i]["text"]);
                        if($relatedArticles[$i]["id"] == $article["id"]){
                            array_splice($relatedArticles, $i, 1);
                            $i--;
                        }
                    }
                    return json_encode(array('result' => $article, 'relatedArticles' => $relatedArticles));
                }else{
                    return json_encode(array('error' => "FAQ Category does not exist"));
                }
            }else{
                return json_encode(array('error' => "FAQ Subcategory does not exist"));
            }
        }else{
            return json_encode(array('error' => "FAQ Article does not exist"));
        }
    }else{
        return json_encode(array('error' => "Wrong data"));
    }
}

?>

