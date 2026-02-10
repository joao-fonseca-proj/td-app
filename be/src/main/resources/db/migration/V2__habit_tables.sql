create table habit
(
    created_at datetime(6) not null,
    id         bigint not null auto_increment,
    panel_id   bigint not null,
    updated_at datetime(6) not null,
    name       varchar(255),
    category   enum ('GENERAL','WORK'),
    frequency  enum ('EVERY'),
    primary key (id)
) engine=InnoDB;
create table habit_days
(
    habit_id     bigint not null,
    days_of_week enum ('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY')
) engine=InnoDB;

ALTER TABLE todo
    ADD COLUMN habit_id BIGINT,
ADD CONSTRAINT fk_todo_habit
    FOREIGN KEY (habit_id)
    REFERENCES habit(id);
alter table habit
    add constraint FK7nixwx845vy7bg3us927865vi foreign key (panel_id) references panel (id);
alter table habit_days
    add constraint FK83xxoiikesnliplg1hpume065 foreign key (habit_id) references habit (id);