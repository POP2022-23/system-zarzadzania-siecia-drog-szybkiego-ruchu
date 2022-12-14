package com.pop.mapmodel.domain;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Table
@Entity
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Road {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "road")
    private List<RoadNode> nodes = new ArrayList<>();

    @Column
    private double length;

    @Column
    private String name;

    public Road(List<RoadNode> nodes, double length, String name) {
        this.nodes = nodes;
        this.length = length;
        this.name = name;
    }

    public void updateNodes(final List<RoadNode> updatedNodes) {
        nodes.clear();
        nodes.addAll(updatedNodes);
    }
}
