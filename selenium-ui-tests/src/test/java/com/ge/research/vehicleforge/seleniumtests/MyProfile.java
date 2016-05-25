package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MyProfile extends BaseTest{
	
	public void myProfile() throws Exception{
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("Profile", driver.getTitle());	
	}
	
	@Test
	public void testMyProfile() throws Exception{
		//navigate to myProfile
		myProfile();
		
		//validate HISTORY, SKILLS, CONTRACT
		assertEquals("HISTORY", driver.findElement(By.xpath("//md-tab-item/span")).getText());
	    driver.findElement(By.xpath("//md-tab-item[2]/span")).click();
	    assertEquals("SKILLS", driver.findElement(By.xpath("//md-tab-item[2]/span")).getText());
	    driver.findElement(By.xpath("//md-tab-item[3]")).click();
	    assertEquals("CONTACT", driver.findElement(By.xpath("//md-tab-item[3]/span")).getText());
	    
	    //Edit profile
	    driver.findElement(By.xpath("//div[2]/a/span")).click();
	   /* WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span")));
        element.click();*/
	    
	    driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
	    driver.findElement(By.xpath("//div/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//div/md-input-container/input")).sendKeys("Thomas Smith");
	    driver.findElement(By.xpath("//md-input-container[2]/input")).clear();
	    driver.findElement(By.xpath("//md-input-container[2]/input")).sendKeys("Engineering Manager");
	    driver.findElement(By.xpath("//div[2]/div/md-input-container[2]/input")).clear();
	    driver.findElement(By.xpath("//div[2]/div/md-input-container[2]/input")).sendKeys("Berkeley, California");
	    driver.findElement(By.xpath("//button[2]")).click();
	    assertEquals("Thomas Smith Engineering Manager", driver.findElement(By.xpath("//h2")).getText());
	    assertEquals("Berkeley, California", driver.findElement(By.xpath("//h3[2]")).getText());
	    
	}

	
}
