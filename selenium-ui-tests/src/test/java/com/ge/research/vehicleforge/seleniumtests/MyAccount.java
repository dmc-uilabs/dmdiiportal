package com.ge.research.vehicleforge.seleniumtests;


import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MyAccount extends BaseTest {
	
	@Test
	public void testMyAccount() throws Exception{
		//testDMCLogin();
		
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		
		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span")));
        element.click();
	    
	    
	    System.out.println("Get current title:" + driver.getTitle());
	    
	    driver.findElement(By.id("editFirstName")).clear();
	    driver.findElement(By.id("editFirstName")).sendKeys("Thomasfixed");
	    driver.findElement(By.id("input_1")).clear();
	    driver.findElement(By.id("input_1")).sendKeys("Smithfixed");
	    
	    driver.findElement(By.xpath("//button[3]")).click();
	}

}
