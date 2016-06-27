package com.ge.research.vehicleforge.seleniumtests;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

import org.junit.*;


import static org.junit.Assert.*;

import org.openqa.selenium.*;

public class NewDiscussionFromDiscussionsPageTest extends BaseTest{
	
	
	
	
	@Test
	public void testNewDiscussion() throws Exception {
		
		String header = TestUtils.getHeader();
		String discussionsPage = baseUrl + "/project.php#/1/discussions";
		driver.get(discussionsPage);
		String discussionName = header + "testing for selenium";
		String discussionMessage = header + "new discussion from discussions page";
		String discussionTag = header + "test tags";
		String discussionReply = header + "test a reply";
		String discussionFlag = header + "test a flag";
		String discussionComment = header + "test a comment";
		
		
	    driver.findElement(By.xpath("//div/button")).click();
	    driver.findElement(By.xpath("//md-dialog/div/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//md-dialog/div/md-input-container/input")).sendKeys(discussionName);
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(discussionMessage);
	    driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).sendKeys(discussionTag);
	    driver.findElement(By.xpath("//div[2]/div/form/button")).click();
	    driver.findElement(By.xpath("//button[2]")).click();
	    WebElement reply = driver.findElement(By.linkText("Reply"));
	    if(reply.isEnabled()){
	    	reply.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.SEVERE,"Can not click the button Reply!!!");
		}
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(discussionReply);
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    driver.findElement(By.linkText("Flag")).click();
	    driver.findElement(By.xpath("//md-select")).click();
	    driver.findElement(By.xpath("//md-option/div")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(discussionFlag);
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    driver.findElement(By.xpath("//div[2]/button")).click();
	    driver.findElement(By.xpath("//div[3]/button[2]")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(discussionComment);
	    driver.findElement(By.xpath("//form/div/button")).click();
	   
	    assertTrue(driver.getPageSource().contains(discussionReply));
	  
	    assertTrue(driver.getPageSource().contains(discussionComment));
	    
	    driver.get(discussionsPage);
	    
	    driver.manage().timeouts().pageLoadTimeout(15, TimeUnit.SECONDS);
	    
	    String table = driver.findElement(By.xpath("/html/body/div[2]/ui-view/div[2]/div/md-content")).getText();
	    	   
	    assertTrue(table.contains(discussionName));
		
	    
	    
	    
	}
	
	

	
}
