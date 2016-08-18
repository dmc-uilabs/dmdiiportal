package com.ge.research.vehicleforge.seleniumtests;

import org.openqa.selenium.*;

public class TasksPageTest extends BaseTest {

	public void testTasksPage() throws Exception {

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
