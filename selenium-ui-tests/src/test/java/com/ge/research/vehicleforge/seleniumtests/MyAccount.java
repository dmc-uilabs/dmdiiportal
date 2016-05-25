package com.ge.research.vehicleforge.seleniumtests;


import static org.junit.Assert.*;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MyAccount extends BaseTest {
	
	private String firstName = "Thomas-changed";
	private String lastName = "Smith-changed";
	private String location = "Schenectady";
	private String timeZone = "(UTC -05:00) America/Atikokan";
	
	public void myAccount() throws Exception{
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("Manage Account", driver.getTitle());	
	}
	
	
	@Test
	public void testMyAccountBascis() throws Exception{
	    myAccount();
		
	    //edit firstName, lastName;
	    driver.findElement(By.id("editFirstName")).clear();
	    driver.findElement(By.id("editFirstName")).sendKeys(firstName);
	    driver.findElement(By.id("input_1")).clear();
	    driver.findElement(By.id("input_1")).sendKeys(lastName);
	    
	    //edit location and time zone;
	    driver.findElement(By.id("input_4")).clear();
	    driver.findElement(By.id("input_4")).sendKeys(location);
	    driver.findElement(By.id("fl-input-5")).clear();
	    driver.findElement(By.id("fl-input-5")).sendKeys("UTC -05:00");
	    driver.findElement(By.xpath("//li/span")).click();
    
	    driver.findElement(By.xpath("//button[3]")).click();
	    
	    //validate changed values
	    String firstNameChanged = driver.findElement(By.id("editFirstName")).getAttribute("value");
	    String lastNameChanged = driver.findElement(By.id("input_1")).getAttribute("value");
	    String locationChanged = driver.findElement(By.id("input_4")).getAttribute("value");
	    String timeZoneChanged = driver.findElement(By.id("fl-input-5")).getAttribute("value");
	    
	    assertEquals(firstName, firstNameChanged);
	    assertEquals(lastName, lastNameChanged);
	    assertEquals(location, locationChanged);
	    assertEquals(timeZone, timeZoneChanged);
	   
	}
	
	
	@Test
	public void testMyAccountPrivacy() throws Exception{
		//navigate to PRIVACY tab
		driver.findElement(By.xpath("//md-list-item[2]/a/div/div")).click();
		
		// uncheck all public information
	    driver.findElement(By.xpath("//md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[3]/md-checkbox/div")).click();
	    
	    //uncheck all private information
	    driver.findElement(By.xpath("//md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[3]/md-checkbox/div")).click();
	    
	    //check all public information
	    driver.findElement(By.xpath("//div[2]/div/div/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[3]/md-checkbox/div")).click();
	    
	    // check all private information
	    driver.findElement(By.xpath("//div[2]/div/div/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[3]/md-checkbox/div")).click();
	    
	    //save changes
	    driver.findElement(By.xpath("//button[2]")).click();
	}
	
	
	@Test
	public void testMyAccountNotification() throws Exception{
		//navigate to NOTIFICATIONS tab
		driver.findElement(By.xpath("//md-list-item[3]/a/div/div")).click();
		//navigate to EMAIL sub-tab
		driver.findElement(By.xpath("//md-tab-item[2]/span")).click();
		assertEquals("EMAIL", driver.findElement(By.xpath("//md-tab-item[2]/span")).getText());
		//navigate to WEBSITE sub-tab
	    driver.findElement(By.xpath("//md-tab-item/span")).click();
	    assertEquals("WEBSITE", driver.findElement(By.xpath("//md-tab-item")).getText());
		
		
	}

}
