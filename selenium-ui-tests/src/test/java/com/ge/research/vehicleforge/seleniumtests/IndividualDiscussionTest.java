package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import java.util.concurrent.TimeUnit;

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
		//this.setUp();
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/my-projects.php#/");
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		WebElement clickViewAll = driver.findElement(By.xpath("(//a[contains(text(),'View All (6)')])[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", clickViewAll);
		if(clickViewAll.isEnabled()){
			clickViewAll.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button View All!!!");
		}
		
		/*Integer iBottom = clickViewAll.getSize().height;
	    Integer iRight = clickViewAll.getSize().width;
	    actions.moveToElement(clickViewAll, iRight/2, iBottom/2).click().perform();
		*/
		
	    driver.findElement(By.linkText("Created from discussions project page")).click();
	    driver.findElement(By.linkText("Reply")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys("selenium reply");
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys("selenium comment");
	    driver.findElement(By.xpath("//form/div/button")).click();
	    driver.findElement(By.linkText("Flag")).click();
	    driver.findElement(By.xpath("//md-select")).click();
	    driver.findElement(By.xpath("//md-option")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys("selenium flag");
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    WebElement likeButton = driver.findElement(By.xpath("//div[4]/div[3]/div[2]/button"));
	    if(likeButton.isEnabled()){
	    	likeButton.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button Like!!!");
		}
	    WebElement dislikeButton = driver.findElement(By.xpath("//div[4]/div[3]/div[2]/button[2]"));
	    if(dislikeButton.isEnabled()){
	    	dislikeButton.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button Dislike!!!");
		}
	    WebElement followUnfollowButton = driver.findElement(By.xpath("//div/button"));
	    if(followUnfollowButton.isEnabled()){
	    	followUnfollowButton.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button Follow!!!");
		}
	    
	    if(followUnfollowButton.isEnabled()){
	    	followUnfollowButton.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button Unfollow!!!");
		}
	   // driver.findElement(By.xpath("//div/button")).click();
	}


}
