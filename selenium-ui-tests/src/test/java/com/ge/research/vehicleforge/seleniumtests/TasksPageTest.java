package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class TasksPageTest extends BaseTest {

	@Test
	public void testTasksPage() throws Exception {

		String header = TestUtils.getHeader();  	  
		 driver.get(baseUrl + "/project.php#/5/tasks");
		    driver.findElement(By.xpath("//th/div")).click();
		    driver.findElement(By.xpath("//th/div")).click();
		    driver.findElement(By.xpath("//th[2]/div")).click();
		    driver.findElement(By.xpath("//th[2]/div")).click();
		    driver.findElement(By.xpath("//th[3]/div")).click();
		    driver.findElement(By.xpath("//th[3]/div")).click();
		    driver.findElement(By.xpath("//th[4]/div")).click();
		    driver.findElement(By.xpath("//th[4]/div")).click();
		    driver.findElement(By.xpath("//tr[3]/td/a")).click();
		    driver.findElement(By.xpath("//div/div/button")).click();
		    driver.findElement(By.xpath("//div/div/button")).click();
		    driver.findElement(By.xpath("//div/div/button")).click();
	}


}
