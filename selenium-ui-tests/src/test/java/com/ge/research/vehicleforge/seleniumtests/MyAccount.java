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
	
	@Test
	public void testMyAccount() throws Exception{
		
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("Manage Account", driver.getTitle());
	    
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

}
