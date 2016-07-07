package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MenuNavigationTest extends BaseTest {
	WebDriverWait wait = new WebDriverWait(driver, 30);
	
	@Test
	public void testMenuNavigation() throws Exception{
		driver.findElement(By.xpath("html/body/div[1]/header/div[2]/div/div/div/div/a[1]/span")).click();
	    assertEquals("Dashboard", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
	    Thread.sleep(2000);
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span"))).click();
	    assertEquals("Marketplace", driver.getTitle());
	    
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span"))).click();
	    assertEquals("Company", driver.getTitle());
	    
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span"))).click();
	    assertEquals("All Favorites", driver.getTitle());
	    
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//a[2]/span")).click();
	    assertEquals("Community", driver.getTitle());
	    
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span"))).click();
	    assertEquals("My Projects", driver.getTitle());
	    
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span"))).click();
	    assertEquals("All Projects", driver.getTitle());
	    
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[3]/button")).click(); 
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span"))).click();
	    assertEquals("Member Directory", driver.getTitle());
	    
	    /*driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[3]/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span"))).click();*/

	}

}
