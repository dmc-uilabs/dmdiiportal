package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class NewDiscussionFromDiscussionsPageTest extends BaseTest{
	

	@Test
	public void testNewDiscussion() throws Exception {
		
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/project.php#/1/discussions");
	    driver.findElement(By.xpath("//div/button")).click();
	    driver.findElement(By.xpath("//md-dialog/div/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//md-dialog/div/md-input-container/input")).sendKeys("testing for selenium");
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys("new discussion from discussions page");
	    driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).sendKeys("test tags");
	    driver.findElement(By.xpath("//div[2]/div/form/button")).click();
	    driver.findElement(By.xpath("//button[2]")).click();
	    WebElement reply = driver.findElement(By.linkText("Reply"));
	    if(reply.isEnabled()){
	    	reply.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button Follow!!!");
		}
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "test a reply");
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    driver.findElement(By.linkText("Flag")).click();
	    driver.findElement(By.xpath("//md-select")).click();
	    driver.findElement(By.xpath("//md-option/div")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "test a flag");
	    driver.findElement(By.xpath("//form/div/div/button[2]")).click();
	    driver.findElement(By.xpath("//div[2]/button")).click();
	    driver.findElement(By.xpath("//div[3]/button[2]")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(header + "test a comment");
	    driver.findElement(By.xpath("//form/div/button")).click();
	}

	
}
