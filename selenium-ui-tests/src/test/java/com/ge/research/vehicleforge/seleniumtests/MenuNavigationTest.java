package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import org.junit.Test;
import org.openqa.selenium.By;

public class MenuNavigationTest extends BaseTest {
	
	@Test
	public void testMenuNavigation() throws Exception{
		driver.findElement(By.xpath("//a/span")).click();
	    assertEquals("Dashboard", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
	    driver.findElement(By.xpath("//md-menu-item/a/span")).click();
	    assertEquals("Marketplace", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
	    driver.findElement(By.xpath("//md-menu-item[2]/a/span")).click();
	    assertEquals("Company", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
	    driver.findElement(By.xpath("//md-menu-item[3]/a/span")).click();
	    assertEquals("All Favorites", driver.getTitle());
	    driver.findElement(By.xpath("//a[2]/span")).click();
	    assertEquals("Community", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    driver.findElement(By.xpath("//md-menu-item/a/span")).click();
	    assertEquals("My Projects", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    driver.findElement(By.xpath("//md-menu-item[2]/a/span")).click();
	    assertEquals("All Projects", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[3]/button")).click();
	    driver.findElement(By.xpath("//md-menu-item/a/span")).click();
	    assertEquals("Member Directory", driver.getTitle());
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[3]/button")).click();
	    driver.findElement(By.xpath("//md-menu-item[2]/a/span")).click();
	}

}
