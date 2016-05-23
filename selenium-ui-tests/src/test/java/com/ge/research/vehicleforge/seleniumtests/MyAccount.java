package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import org.junit.Test;
import org.openqa.selenium.By;

public class MyAccount extends BaseTest {
	
	@Test
	public void testMyAccount() throws Exception{
		testDMCLogin();
		
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
	    driver.findElement(By.xpath("//md-menu-item/a/span")).click();
	    assertEquals("Manage Account", driver.getTitle());
	   /* driver.findElement(By.id("editFirstName")).clear();
	    driver.findElement(By.id("editFirstName")).sendKeys("Test First Name change1");
	    driver.findElement(By.xpath("//button[3]")).click();*/
	}

}
