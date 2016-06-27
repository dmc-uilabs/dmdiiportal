package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


@SuppressWarnings("unused")
public class IndividualDiscussionTest extends BaseTest{
	
	



	@Test
	public void testIndividualDiscussion() throws Exception {
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/my-projects.php#/");
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		WebElement clickViewAll = 
				driver.findElement(By.xpath("/html/body/div[2]/div[2]/div/div[2]/md-content[10]/div/div[2]/md-content[2]/div/a"));
		jse.executeScript("arguments[0].scrollIntoView(true);", clickViewAll);
		if(clickViewAll.isEnabled()){
			clickViewAll.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.SEVERE,"Can not click the button View All!!!");
		}
		
		String projectsPage = driver.getCurrentUrl();
		
		WebElement numReplies = driver.findElement
				(By.xpath("/html/body/div[2]/ui-view/div[2]/div/md-content/"
						+ "div[2]/md-data-table-container/table/tbody/tr[10]/td[2]"));
		int replyCount = Integer.parseInt(numReplies.getText().split("\\s+")[0]);
		
	    driver.findElement(By.linkText("Created from discussions project page")).click();
	    driver.findElement(By.linkText("Reply")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "selenium reply");
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "selenium comment");
	    driver.findElement(By.xpath("//form/div/button")).click();
	    driver.findElement(By.linkText("Flag")).click();
	    driver.findElement(By.xpath("//md-select")).click();
	    driver.findElement(By.xpath("//md-option")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "selenium flag");
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    WebElement likeButton = driver.findElement(By.xpath("//div[4]/div[3]/div[2]/button"));
	    if(likeButton.isEnabled()){
	    	likeButton.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.SEVERE,"Can not click the button Like!!!");
		}
	    
	    assertTrue(likeButton.isEnabled());
	    
	    WebElement dislikeButton = driver.findElement(By.xpath("//div[4]/div[3]/div[2]/button[2]"));
	    if(dislikeButton.isEnabled()){
	    	dislikeButton.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.SEVERE,"Can not click the button Dislike!!!");
		}
	    
	    assertTrue(dislikeButton.isEnabled());
	    
	    WebElement followUnfollowButton = driver.findElement(By.xpath("//div/button"));
	    if(followUnfollowButton.isEnabled()){
	    	followUnfollowButton.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.SEVERE,"Can not click the button Follow!!!");
		} 
	    
	    String firstClick = followUnfollowButton.getText();
	    followUnfollowButton = driver.findElement(By.xpath("//div/button"));
	    if(followUnfollowButton.isEnabled()){
	    	followUnfollowButton.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.SEVERE,"Can not click the button Unfollow!!!");
		}
	    String secondClick = followUnfollowButton.getText();
	    assertTrue((firstClick.equals("FOLLOW") && secondClick.equals("UNFOLLOW")) 
	    		|| (firstClick.equals("UNFOLLOW") && secondClick.equals("FOLLOW")));
	   // driver.findElement(By.xpath("//div/button")).click();
	    driver.get(projectsPage);
	    numReplies = driver.findElement
				(By.xpath("/html/body/div[2]/ui-view/div[2]/div/md-content/"
						+ "div[2]/md-data-table-container/table/tbody/tr[10]/td[2]"));
	    int newReplyCount = Integer.parseInt(numReplies.getText().split("\\s+")[0]);
	    assertEquals(newReplyCount, replyCount + 1);
	}


}
